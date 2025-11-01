import { makeAutoObservable } from 'mobx'
import { Params } from 'react-router-dom'
import { IBranchModel, IProjectModel, IRevisionModel, IRowModel, ITableModel } from 'src/shared/model/BackendStore'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { IRowForeignKeysByModel } from 'src/shared/model/BackendStore/model'
import { IOrganizationModel } from 'src/shared/model/BackendStore/model/organization.mst.ts'

export class ProjectPageModel {
  constructor(
    public readonly cache: ICacheModel,
    public readonly revalidateLoaders: () => void,
    private params: Params<string>,
    public organization: IOrganizationModel,
    public project: IProjectModel,
    public branch: IBranchModel | null,
    public revision: IRevisionModel | null,
    public table: ITableModel | null,
    public row: IRowModel | null,
  ) {
    makeAutoObservable(this)
  }

  public get branchOrThrow(): IBranchModel {
    if (!this.branch) {
      throw new Error('Not found branch from route loader')
    }

    return this.branch
  }

  public get revisionOrThrow(): IRevisionModel {
    if (!this.revision) {
      throw new Error('Not found revision from route loader')
    }

    return this.revision
  }

  public get tableOrThrow(): ITableModel {
    if (!this.table) {
      throw new Error('Not found table from route loader')
    }

    return this.table
  }

  public get isStartRevision() {
    return this.branchOrThrow.start.id === this.revisionOrThrow.id
  }

  public get isHeadRevision() {
    return this.branchOrThrow.head.id === this.revisionOrThrow.id
  }

  public get isDraftRevision() {
    return this.branchOrThrow.draft.id === this.revisionOrThrow.id
  }

  public get isStartAndHeadSameRevision() {
    return this.branchOrThrow.head.id === this.branchOrThrow.start.id
  }

  public get isEditableRevision() {
    return this.isDraftRevision
  }

  public get rowOrThrow(): IRowModel {
    if (!this.row) {
      throw new Error('Not found row from route loader')
    }

    return this.row
  }

  public get rowRefsBy(): IRowForeignKeysByModel | undefined {
    if (this.revision && this.table && this.row) {
      return this.cache.getRowForeignKeysByVariables({
        revisionId: this.revision.id,
        tableId: this.table.id,
        rowId: this.row.id,
      })
    }
  }

  public get routeOrganizationId() {
    return this.params.organizationId
  }

  public get routeProjectName() {
    return this.params.projectName
  }

  public get routeBranchName() {
    return this.params.branchName
  }

  public get routeRevisionId() {
    return this.params.revisionId
  }

  public get routeTableId() {
    return this.params.tableId
  }

  public get routeRowId() {
    return this.params.rowId
  }

  update(options: {
    params: Params<string>
    organization: IOrganizationModel
    project: IProjectModel
    branch: IBranchModel | null
    revision: IRevisionModel | null
    table: ITableModel | null
    row: IRowModel | null
  }) {
    for (const [key, value] of Object.entries(options)) {
      if (this[key] !== value) {
        this[key] = value
      }
    }
  }

  public init() {}

  public dispose() {}
}
