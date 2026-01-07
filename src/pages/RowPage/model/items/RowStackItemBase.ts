import { computed, makeObservable, observable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { StackItem } from 'src/shared/lib/Stack'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { RowStackItemType, RowStackItemResult, SelectForeignKeyRowPayload } from '../../config/types.ts'

export interface RowStackItemBaseDeps {
  projectContext: ProjectContext
  permissionContext: PermissionContext
  tableId: string
}

export abstract class RowStackItemBase extends StackItem<RowStackItemResult> {
  public abstract readonly type: RowStackItemType
  public readonly isSelectingForeignKey: boolean
  public readonly tableId: string

  private _isFirstLevel = false

  protected constructor(
    protected readonly deps: RowStackItemBaseDeps,
    isSelectingForeignKey: boolean,
  ) {
    super()
    this.isSelectingForeignKey = isSelectingForeignKey
    this.tableId = deps.tableId

    makeObservable<RowStackItemBase, '_isFirstLevel'>(this, {
      _isFirstLevel: observable,
      isFirstLevel: computed,
      showBreadcrumbs: computed,
      isEditableRevision: computed,
      revisionId: computed,
      pendingForeignKeyPath: computed,
    })
  }

  public get isFirstLevel(): boolean {
    return this._isFirstLevel
  }

  public setIsFirstLevel(value: boolean): void {
    this._isFirstLevel = value
  }

  public get showBreadcrumbs(): boolean {
    return this._isFirstLevel && !this.isSelectingForeignKey
  }

  public get isEditableRevision(): boolean {
    return this.deps.projectContext.isDraftRevision
  }

  public get revisionId(): string {
    return this.deps.projectContext.revision.id
  }

  public get pendingForeignKeyPath(): string {
    const payload = this.pendingRequest?.payload as SelectForeignKeyRowPayload | undefined
    const foreignKeyNode = payload?.foreignKeyNode
    if (foreignKeyNode) {
      return foreignKeyNode.foreignKey ?? ''
    }
    return ''
  }
}
