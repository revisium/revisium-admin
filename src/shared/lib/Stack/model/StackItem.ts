import { action, computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { StackRequest } from './types.ts'

export type ItemResolver<TResult> = (result: TResult) => void

export class StackItem<TResult = void> {
  public readonly id = nanoid()

  private pendingRequestInternal: StackRequest<unknown, unknown> | null = null
  private resolverInternal: ItemResolver<TResult> | null = null

  constructor() {
    makeObservable<StackItem<TResult>, 'pendingRequestInternal'>(this, {
      pendingRequestInternal: observable,
      hasPendingRequest: computed,
      pendingRequest: computed,
      setPendingRequest: action,
      clearPendingRequest: action,
    })
  }

  public setResolver(resolver: ItemResolver<TResult>): void {
    this.resolverInternal = resolver
  }

  protected resolve(result: TResult): void {
    this.resolverInternal?.(result)
  }

  public get hasPendingRequest(): boolean {
    return this.pendingRequestInternal !== null
  }

  public get pendingRequest(): StackRequest<unknown, unknown> | null {
    return this.pendingRequestInternal
  }

  public setPendingRequest<TPayload, TResult>(request: StackRequest<TPayload, TResult>): void {
    this.pendingRequestInternal = request as StackRequest<unknown, unknown>
  }

  public clearPendingRequest(): void {
    this.pendingRequestInternal = null
  }

  public init(): void {}

  public dispose(): void {}
}
