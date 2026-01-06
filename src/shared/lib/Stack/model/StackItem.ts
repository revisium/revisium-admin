import { action, computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { StackRequest } from './types.ts'

export class StackItem<TState> {
  public readonly id = nanoid()
  public state: TState

  private pendingRequestInternal: StackRequest<unknown, unknown> | null = null

  constructor(initialState: TState) {
    this.state = initialState
    makeObservable<StackItem<TState>, 'pendingRequestInternal'>(this, {
      state: observable,
      pendingRequestInternal: observable,
      hasPendingRequest: computed,
      pendingRequest: computed,
      setPendingRequest: action,
      clearPendingRequest: action,
    })
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
