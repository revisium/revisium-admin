import { observable, runInAction } from 'mobx'
import { type PrimitiveValueNode } from '@revisium/schema-toolkit-ui'
import { PatchRowOp } from 'src/__generated__/graphql-request'
import { JsonValue } from 'src/entities/Schema/types/json.types'
import { AbortError, ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { client } from 'src/shared/model/ApiService'

type PrimitiveValue = string | number | boolean

const SAVING_INDICATOR_DELAY = 1000

const makeCellKey = (rowId: string, field: string): string => `${rowId}:${field}`

interface SaveContext {
  revisionId: string
  tableId: string
}

export class CellSaveService {
  private readonly _savingCells = observable.map<string, boolean>()
  private readonly _savingTimers = new Map<string, ReturnType<typeof setTimeout>>()
  private readonly _errorCells = observable.map<string, string>()
  private readonly patchRowRequest = ObservableRequest.of(client.PatchRowInline)

  public isSaving(rowId: string, field: string): boolean {
    return this._savingCells.get(makeCellKey(rowId, field)) === true
  }

  public getError(rowId: string, field: string): string | undefined {
    return this._errorCells.get(makeCellKey(rowId, field))
  }

  public hasError(rowId: string, field: string): boolean {
    return this._errorCells.has(makeCellKey(rowId, field))
  }

  public clearError(rowId: string, field: string): void {
    this._errorCells.delete(makeCellKey(rowId, field))
  }

  public dispose(): void {
    this._savingCells.clear()
    this._errorCells.clear()
    for (const timer of this._savingTimers.values()) {
      clearTimeout(timer)
    }
    this._savingTimers.clear()
  }

  public async save(
    context: SaveContext,
    rowId: string,
    columnId: string,
    fieldName: string,
    value: PrimitiveValue,
    node: PrimitiveValueNode | undefined,
    onSuccess?: () => void,
  ): Promise<boolean> {
    const key = makeCellKey(rowId, columnId)

    const oldValue = this.applyOptimisticUpdate(node, value)
    this.startSavingIndicator(key)
    this._errorCells.delete(key)

    try {
      const result = await this.callApi(context, rowId, fieldName, value)

      if (result.isRight) {
        runInAction(() => {
          this._errorCells.delete(key)
          node?.commit()
          onSuccess?.()
        })
        return true
      }

      if (result.error instanceof AbortError) {
        return false
      }

      this.handleError(key, node, oldValue, 'Failed to save')
      return false
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      this.handleError(key, node, oldValue, message)
      return false
    } finally {
      this.stopSavingIndicator(key)
    }
  }

  private applyOptimisticUpdate(
    node: PrimitiveValueNode | undefined,
    value: PrimitiveValue,
  ): PrimitiveValue | undefined {
    if (!node) {
      return undefined
    }

    const oldValue = node.value
    node.setValue(value)
    return oldValue
  }

  private rollbackOptimisticUpdate(node: PrimitiveValueNode | undefined, oldValue: PrimitiveValue | undefined): void {
    if (!node || oldValue == null) {
      return
    }
    node.setValue(oldValue)
  }

  private startSavingIndicator(key: string): void {
    const existingTimer = this._savingTimers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const timer = setTimeout(() => {
      runInAction(() => {
        this._savingCells.set(key, true)
      })
    }, SAVING_INDICATOR_DELAY)

    this._savingTimers.set(key, timer)
  }

  private stopSavingIndicator(key: string): void {
    const pendingTimer = this._savingTimers.get(key)
    if (pendingTimer) {
      clearTimeout(pendingTimer)
      this._savingTimers.delete(key)
    }
    runInAction(() => {
      this._savingCells.delete(key)
    })
  }

  private async callApi(context: SaveContext, rowId: string, fieldName: string, value: JsonValue) {
    return this.patchRowRequest.fetch({
      data: {
        revisionId: context.revisionId,
        tableId: context.tableId,
        rowId,
        patches: [
          {
            op: PatchRowOp.Replace,
            path: fieldName,
            value: value as string | number | boolean | { [key: string]: unknown } | null,
          },
        ],
      },
    })
  }

  private handleError(
    key: string,
    node: PrimitiveValueNode | undefined,
    oldValue: PrimitiveValue | undefined,
    message: string,
  ): void {
    runInAction(() => {
      this.rollbackOptimisticUpdate(node, oldValue)
      this._errorCells.set(key, message)
    })
  }
}
