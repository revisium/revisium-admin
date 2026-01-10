import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { CollapsedRevisionsNodeData } from '../../lib/types.ts'

export class CollapsedNodeViewModel {
  public readonly x: number
  public readonly y: number
  private _isHighlighted = false
  private _isDimmed = false

  constructor(
    private readonly _id: string,
    private readonly _branchId: string,
    private readonly _count: number,
    private readonly _fromRevisionId: string,
    private readonly _toRevisionId: string,
    x: number,
    y: number,
  ) {
    this.x = x
    this.y = y
    makeAutoObservable(this, { x: false, y: false }, { autoBind: true })
  }

  public get id(): string {
    return this._id
  }

  public get branchId(): string {
    return this._branchId
  }

  public get count(): number {
    return this._count
  }

  public get fromRevisionId(): string {
    return this._fromRevisionId
  }

  public get toRevisionId(): string {
    return this._toRevisionId
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

export type CreateCollapsedNodeFn = (
  data: CollapsedRevisionsNodeData & { id: string },
  x: number,
  y: number,
) => CollapsedNodeViewModel

export class CollapsedNodeViewModelFactory {
  constructor(public readonly create: CreateCollapsedNodeFn) {}
}

container.register(
  CollapsedNodeViewModelFactory,
  () =>
    new CollapsedNodeViewModelFactory(
      (data, x, y) =>
        new CollapsedNodeViewModel(data.id, data.branchId, data.count, data.fromRevisionId, data.toRevisionId, x, y),
    ),
  { scope: 'singleton' },
)
