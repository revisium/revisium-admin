import { makeAutoObservable } from 'mobx'
import { RelationEdge } from '../lib/types.ts'

export class RelationEdgeViewModel {
  public readonly id: string
  public readonly sourceTableId: string
  public readonly targetTableId: string
  public readonly fieldPath: string
  public readonly curveOffset: number

  private _isHighlighted = false

  constructor(data: RelationEdge) {
    this.id = data.id
    this.sourceTableId = data.sourceTableId
    this.targetTableId = data.targetTableId
    this.fieldPath = data.fieldPath
    this.curveOffset = data.curveOffset

    makeAutoObservable(this, {
      id: false,
      sourceTableId: false,
      targetTableId: false,
      fieldPath: false,
      curveOffset: false,
    })
  }

  public get isHighlighted(): boolean {
    return this._isHighlighted
  }

  public setHighlighted(value: boolean): void {
    this._isHighlighted = value
  }
}
