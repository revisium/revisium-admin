import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { ProjectGraphEdge, RevisionMapEdge } from '../../lib/types.ts'

export class RevisionEdgeViewModel {
  public readonly id: string
  public readonly sourceId: string
  public readonly targetId: string
  public readonly sourceHandle: string | undefined
  public readonly targetHandle: string | undefined
  public readonly edgeType: 'revision' | 'branch' | 'endpoint-graphql' | 'endpoint-rest' | 'parent-to-branch'

  private _isHighlighted = false

  constructor(data: RevisionMapEdge) {
    this.id = data.id
    this.sourceId = data.sourceId
    this.targetId = data.targetId
    this.sourceHandle = data.sourceHandle
    this.targetHandle = data.targetHandle
    this.edgeType = data.type

    makeAutoObservable(this, {
      id: false,
      sourceId: false,
      targetId: false,
      sourceHandle: false,
      targetHandle: false,
      edgeType: false,
    })
  }

  public get isHighlighted(): boolean {
    return this._isHighlighted
  }

  public setHighlighted(value: boolean): void {
    this._isHighlighted = value
  }
}

export type CreateEdgeFn = (edge: ProjectGraphEdge) => RevisionEdgeViewModel

export class RevisionEdgeViewModelFactory {
  constructor(public readonly create: CreateEdgeFn) {}
}

container.register(
  RevisionEdgeViewModelFactory,
  () =>
    new RevisionEdgeViewModelFactory(
      (edge) =>
        new RevisionEdgeViewModel({
          id: edge.id,
          sourceId: edge.sourceId,
          targetId: edge.targetId,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type,
          isHighlighted: false,
        }),
    ),
  { scope: 'singleton' },
)
