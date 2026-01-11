import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { ProjectGraphBranch } from '../../lib/types.ts'

export class ProjectBranchNodeViewModel {
  public readonly x: number
  public readonly y: number
  private _isHighlighted = false
  private _isDimmed = false

  constructor(
    private readonly _branch: ProjectGraphBranch,
    x: number,
    y: number,
  ) {
    this.x = x
    this.y = y
    makeAutoObservable(this, { x: false, y: false }, { autoBind: true })
  }

  public get id(): string {
    return `branch-${this._branch.id}`
  }

  public get branchId(): string {
    return this._branch.id
  }

  public get name(): string {
    return this._branch.name
  }

  public get isRoot(): boolean {
    return this._branch.isRoot
  }

  public get touched(): boolean {
    return this._branch.touched
  }

  public get createdAt(): string {
    return this._branch.createdAt
  }

  public get parentBranchName(): string | null {
    return this._branch.parentBranchName
  }

  public get isHighlighted(): boolean {
    return this._isHighlighted
  }

  public get isDimmed(): boolean {
    return this._isDimmed
  }

  public setHighlighted(value: boolean): void {
    this._isHighlighted = value
  }

  public setDimmed(value: boolean): void {
    this._isDimmed = value
  }
}

export type CreateBranchNodeFn = (branch: ProjectGraphBranch, x: number, y: number) => ProjectBranchNodeViewModel

export class ProjectBranchNodeViewModelFactory {
  constructor(public readonly create: CreateBranchNodeFn) {}
}

container.register(
  ProjectBranchNodeViewModelFactory,
  () => new ProjectBranchNodeViewModelFactory((branch, x, y) => new ProjectBranchNodeViewModel(branch, x, y)),
  { scope: 'singleton' },
)
