import { computed, makeObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { StackItem } from 'src/shared/lib/Stack'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { TableFetchDataSource } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { TableStackItemType, TableStackItemResult } from '../../config/types.ts'

export interface TableStackItemBaseDeps {
  projectContext: ProjectContext
  projectPermissions: ProjectPermissions
  fetchDataSourceFactory: () => TableFetchDataSource
}

export abstract class TableStackItemBase extends StackItem<TableStackItemResult> {
  public abstract readonly type: TableStackItemType
  public readonly isSelectingForeignKey: boolean

  protected constructor(
    protected readonly deps: TableStackItemBaseDeps,
    isSelectingForeignKey: boolean,
  ) {
    super()
    this.isSelectingForeignKey = isSelectingForeignKey

    makeObservable(this, {
      isEditableRevision: computed,
      revisionId: computed,
      isRevisionLoading: computed,
      hasPendingForeignKeySelection: computed,
    })
  }

  public get isEditableRevision(): boolean {
    return this.deps.projectContext.isDraftRevision
  }

  public get revisionId(): string | null {
    return this.deps.projectContext.revisionId
  }

  public get isRevisionLoading(): boolean {
    return this.deps.projectContext.isLoading || this.deps.projectContext.revisionId === null
  }

  public get hasPendingForeignKeySelection(): boolean {
    return this.pendingRequest !== null
  }
}
