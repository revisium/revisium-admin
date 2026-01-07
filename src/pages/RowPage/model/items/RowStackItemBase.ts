import { computed, makeObservable, observable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonSchema } from 'src/entities/Schema'
import { StackItem } from 'src/shared/lib/Stack'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { RowStackItemType, RowStackItemResult } from '../../config/types.ts'

export interface RowStackItemBaseDeps {
  projectContext: ProjectContext
  permissionContext: PermissionContext
  tableId: string
  schema?: JsonSchema
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
      schema: computed,
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

  public get schema(): JsonSchema | null {
    if (this.deps.schema) {
      return this.deps.schema
    }
    return this.deps.projectContext.table?.schema as JsonSchema | null
  }
}
