import { makeAutoObservable } from 'mobx'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { RevisionData } from '../../lib/types.ts'

export class RevisionNodeViewModel {
  public readonly x: number
  public readonly y: number
  private _isHighlighted = false
  private _isDimmed = false

  constructor(
    private readonly _data: RevisionData,
    x: number,
    y: number,
  ) {
    this.x = x
    this.y = y
    makeAutoObservable(this, { x: false, y: false }, { autoBind: true })
  }

  public get id(): string {
    return this._data.id
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

  public get comment(): string {
    return this._data.comment
  }

  public get isDraft(): boolean {
    return this._data.isDraft
  }

  public get isHead(): boolean {
    return this._data.isHead
  }

  public get isStart(): boolean {
    return this._data.isStart
  }

  public get createdAt(): string {
    return this._data.createdAt
  }

  public get hasEndpoints(): boolean {
    return this._data.hasEndpoints
  }

  public get endpointTypes(): string[] {
    return this._data.endpointTypes
  }

  public get childBranchIds(): string[] {
    return this._data.childBranchIds
  }

  public get hasChildBranches(): boolean {
    return this._data.childBranchIds.length > 0
  }

  public get branchName(): string | undefined {
    return this._data.branchName
  }

  public get badge(): string | null {
    if (this._data.isDraft) {
      return 'draft'
    }
    if (this._data.isHead) {
      return 'head'
    }
    if (this._data.isStart) {
      return 'start'
    }
    return null
  }

  public get tag(): string | undefined {
    if (this._data.isDraft) {
      return DRAFT_TAG
    }
    if (this._data.isHead) {
      return HEAD_TAG
    }
    return undefined
  }

  public get shortId(): string {
    return this._data.id.slice(0, 5)
  }

  public get formattedDate(): string {
    return new Date(this._data.createdAt).toLocaleDateString()
  }
}

export type CreateRevisionNodeFn = (revision: RevisionData, x: number, y: number) => RevisionNodeViewModel

export class RevisionNodeViewModelFactory {
  constructor(public readonly create: CreateRevisionNodeFn) {}
}

container.register(
  RevisionNodeViewModelFactory,
  () => new RevisionNodeViewModelFactory((revision, x, y) => new RevisionNodeViewModel(revision, x, y)),
  { scope: 'singleton' },
)
