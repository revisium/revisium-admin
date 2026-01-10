import { makeAutoObservable } from 'mobx'
import { LayoutNode, RelationEdge } from '../lib/types.ts'

export class TableNodeViewModel {
  public readonly id: string
  public readonly fieldsCount: number
  public readonly rowsCount: number
  public readonly incomingEdges: RelationEdge[]
  public readonly outgoingEdges: RelationEdge[]

  public readonly x: number
  public readonly y: number
  private _isSelected = false
  private _isHighlighted = false
  private _isDimmed = false

  constructor(data: LayoutNode) {
    this.id = data.id
    this.fieldsCount = data.fieldsCount
    this.rowsCount = data.rowsCount
    this.incomingEdges = data.incomingEdges
    this.outgoingEdges = data.outgoingEdges
    this.x = data.x
    this.y = data.y

    makeAutoObservable(this, {
      id: false,
      fieldsCount: false,
      rowsCount: false,
      incomingEdges: false,
      outgoingEdges: false,
      x: false,
      y: false,
    })
  }

  public get incomingCount(): number {
    return this.incomingEdges.length
  }

  public get outgoingCount(): number {
    return this.outgoingEdges.length
  }

  public get isSelected(): boolean {
    return this._isSelected
  }

  public get isHighlighted(): boolean {
    return this._isHighlighted
  }

  public get isDimmed(): boolean {
    return this._isDimmed
  }

  public setSelected(value: boolean): void {
    this._isSelected = value
  }

  public setHighlighted(value: boolean): void {
    this._isHighlighted = value
  }

  public setDimmed(value: boolean): void {
    this._isDimmed = value
  }
}
