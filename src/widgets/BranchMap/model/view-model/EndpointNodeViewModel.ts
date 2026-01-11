import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { EndpointData } from '../../lib/types.ts'

export class EndpointNodeViewModel {
  public readonly id: string
  public readonly x: number
  public readonly y: number
  private _isHighlighted = false
  private _isDimmed = false

  constructor(
    id: string,
    private readonly _endpoints: EndpointData[],
    private readonly _revisionId: string,
    x: number,
    y: number,
  ) {
    this.id = id
    this.x = x
    this.y = y
    makeAutoObservable(this, { id: false, x: false, y: false }, { autoBind: true })
  }

  public get endpoints(): EndpointData[] {
    return this._endpoints
  }

  public get revisionId(): string {
    return this._revisionId
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

  public get hasGraphQL(): boolean {
    return this._endpoints.some((e) => e.type === 'GRAPHQL')
  }

  public get hasREST(): boolean {
    return this._endpoints.some((e) => e.type === 'REST_API')
  }

  public get label(): string {
    const types: string[] = []
    if (this.hasGraphQL) {
      types.push('GraphQL')
    }
    if (this.hasREST) {
      types.push('REST')
    }
    return types.join(' + ')
  }
}

export type CreateEndpointNodeFn = (
  id: string,
  endpoints: EndpointData[],
  revisionId: string,
  x: number,
  y: number,
) => EndpointNodeViewModel

export class EndpointNodeViewModelFactory {
  constructor(public readonly create: CreateEndpointNodeFn) {}
}

container.register(
  EndpointNodeViewModelFactory,
  () =>
    new EndpointNodeViewModelFactory(
      (id, endpoints, revisionId, x, y) => new EndpointNodeViewModel(id, endpoints, revisionId, x, y),
    ),
  { scope: 'singleton' },
)
