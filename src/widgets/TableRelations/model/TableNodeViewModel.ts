import { makeAutoObservable } from 'mobx'
import { LayoutNode, RelationEdge } from '../lib/types.ts'

export class TableNodeViewModel {
  private _isHovered = false
  private _isSelected = false

  constructor(private readonly data: LayoutNode) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return this.data.id
  }

  public get x(): number {
    return this.data.x
  }

  public get y(): number {
    return this.data.y
  }

  public get fieldsCount(): number {
    return this.data.fieldsCount
  }

  public get rowsCount(): number {
    return this.data.rowsCount
  }

  public get incomingCount(): number {
    return this.data.incomingEdges.length
  }

  public get outgoingCount(): number {
    return this.data.outgoingEdges.length
  }

  public get incomingEdges(): RelationEdge[] {
    return this.data.incomingEdges
  }

  public get outgoingEdges(): RelationEdge[] {
    return this.data.outgoingEdges
  }

  public get isHovered(): boolean {
    return this._isHovered
  }

  public get isSelected(): boolean {
    return this._isSelected
  }

  public get hasRelations(): boolean {
    return this.incomingCount > 0 || this.outgoingCount > 0
  }

  public setHovered(value: boolean): void {
    this._isHovered = value
  }

  public setSelected(value: boolean): void {
    this._isSelected = value
  }
}
