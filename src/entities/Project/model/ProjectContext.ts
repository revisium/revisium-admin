import { makeAutoObservable } from 'mobx'
import { container, invariant } from 'src/shared/lib'
import { IBranchModel, IProjectModel, IRevisionModel, IRowModel, ITableModel } from 'src/shared/model/BackendStore'

export class ProjectContext {
  private _project: IProjectModel | null = null
  private _branch: IBranchModel | null = null
  private _revision: IRevisionModel | null = null
  private _table: ITableModel | null = null
  private _row: IRowModel | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get organization() {
    return this.project.organization
  }

  public get project() {
    invariant(this._project, 'ProjectContext: project is not defined')

    return this._project
  }

  public get branch() {
    return this._branch ?? this.project.rootBranch
  }

  public get revision() {
    return this._revision ?? this.branch.draft
  }

  public get isDraftRevision() {
    return this.revision.id === this.branch.draft.id
  }

  public get isHeadRevision() {
    return this.revision.id === this.branch.head.id
  }

  public get table() {
    return this._table
  }

  public get row() {
    return this._row
  }

  public setProject(project: IProjectModel | null): void {
    this._project = project
  }

  public setBranch(branch: IBranchModel | null): void {
    this._branch = branch
  }

  public setRevision(revision: IRevisionModel | null): void {
    this._revision = revision
  }

  public setTable(table: ITableModel | null): void {
    this._table = table
  }

  public setRow(row: IRowModel | null): void {
    this._row = row
  }
}

container.register(
  ProjectContext,
  () => {
    return new ProjectContext()
  },
  { scope: 'singleton' },
)
