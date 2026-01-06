import { action, makeObservable, observable } from 'mobx'
import { StackItem } from './StackItem.ts'
import { createStackRequest } from './StackRequest.ts'
import { StackRequest } from './types.ts'

export abstract class StackManager<TItem extends StackItem<unknown>, TRequestPayload = unknown, TResult = unknown> {
  public stack: [TItem] & TItem[]

  constructor(firstItem: TItem) {
    this.stack = [firstItem] as [TItem] & TItem[]
    makeObservable(this, {
      stack: observable,
      pushRequest: action,
      resolveRequest: action,
      rejectRequest: action,
      cancelFromItem: action,
      dispose: action,
    })
  }

  public pushRequest(
    fromItem: TItem,
    payload: TRequestPayload,
    onResolve: (result: TResult) => void,
    onReject: () => void,
  ): void {
    const request = createStackRequest(payload, onResolve, onReject)
    fromItem.setPendingRequest(request)

    const newItem = this.createItemForRequest(request)
    this.stack.push(newItem)
  }

  public resolveRequest(item: TItem, result: TResult): void {
    const foundIndex = this.stack.findIndex((i) => i === item)
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
    const foundIndex = this.stack.findIndex((i) => i === item)

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
    const foundIndex = this.stack.findIndex((i) => i === item)

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
  }

  protected abstract createItemForRequest(request: StackRequest<TRequestPayload, TResult>): TItem
}
