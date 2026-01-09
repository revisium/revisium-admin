import { action, makeObservable, observable } from 'mobx'
import { StackItem } from './StackItem.ts'
import { createStackRequest } from './StackRequest.ts'
import { StackRequest } from './types.ts'

export abstract class StackManager<
  TItem extends StackItem<TItemResult>,
  TItemResult,
  TRequestPayload = unknown,
  TParentResult = unknown,
> {
  public stack: TItem[] = []

  constructor() {
    makeObservable(this, {
      stack: observable,
      initStack: action.bound,
      pushRequest: action.bound,
      resolveToParent: action.bound,
      rejectRequest: action.bound,
      cancelFromItem: action.bound,
      dispose: action.bound,
    })
  }

  public initStack(firstItem: TItem): void {
    this.stack = [firstItem]
    this.setupItemResolver(firstItem)
  }

  public pushRequest(
    fromItem: TItem,
    payload: TRequestPayload,
    onResolve: (result: TParentResult) => void,
    onReject: () => void,
  ): void {
    const request = createStackRequest(payload, onResolve, onReject)
    fromItem.setPendingRequest(request)

    const newItem = this.createItemForRequest(request)
    this.addItem(newItem)
  }

  public resolveToParent(item: TItem, result: TParentResult): void {
    const foundIndex = this.stack.indexOf(item)
    if (foundIndex === -1) {
      return
    }

    const parentItem = this.stack[foundIndex - 1]
    if (parentItem?.pendingRequest) {
      parentItem.pendingRequest.resolve(result)
      parentItem.clearPendingRequest()
    }

    const removed = this.stack.splice(foundIndex)
    removed.forEach((r) => r.dispose())
  }

  public rejectRequest(item: TItem): void {
    const foundIndex = this.stack.indexOf(item)

    if (foundIndex !== -1) {
      const removed = this.stack.splice(foundIndex + 1)
      removed.forEach((r) => r.dispose())
    }

    const parentIndex = foundIndex - 1
    if (parentIndex >= 0) {
      const parentItem = this.stack[parentIndex]
      if (parentItem.pendingRequest) {
        parentItem.pendingRequest.reject()
        parentItem.clearPendingRequest()
      }
    }
  }

  public cancelFromItem(item: TItem): void {
    const foundIndex = this.stack.indexOf(item)

    if (foundIndex === -1) {
      return
    }

    const removed = this.stack.splice(foundIndex + 1)
    removed.forEach((r) => r.dispose())

    if (item.pendingRequest) {
      item.pendingRequest.reject()
      item.clearPendingRequest()
    }
  }

  public dispose(): void {
    this.stack.forEach((item) => item.dispose())
    this.stack = []
  }

  protected addItem(item: TItem): void {
    this.setupItemResolver(item)
    this.stack.push(item)
  }

  protected abstract handleItemResult(item: TItem, result: TItemResult): void

  protected abstract createItemForRequest(request: StackRequest<TRequestPayload, TParentResult>): TItem

  private setupItemResolver(item: TItem): void {
    item.setResolver((result) => this.handleItemResult(item, result))
  }
}
