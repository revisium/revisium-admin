import { StackItem } from '../model/StackItem.ts'
import { StackManager } from '../model/StackManager.ts'
import { StackRequest } from '../model/types.ts'

interface TestItemResult {
  type: string
  value?: string
}

interface TestPayload {
  query: string
}

type TestParentResult = string

class TestStackItem extends StackItem<TestItemResult> {
  public disposed = false

  public callResolve(result: TestItemResult): void {
    this.resolve(result)
  }

  public dispose(): void {
    this.disposed = true
  }
}

class TestStackManager extends StackManager<TestStackItem, TestItemResult, TestPayload, TestParentResult> {
  public lastRequestPayload: TestPayload | null = null
  public handledResults: Array<{ item: TestStackItem; result: TestItemResult }> = []

  protected handleItemResult(item: TestStackItem, result: TestItemResult): void {
    this.handledResults.push({ item, result })
  }

  protected createItemForRequest(request: StackRequest<TestPayload, TestParentResult>): TestStackItem {
    this.lastRequestPayload = request.payload
    return new TestStackItem()
  }
}

describe('StackManager', () => {
  describe('initialization', () => {
    it('should create with first item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0]).toBe(firstItem)
    })

    it('should setup resolver on first item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      firstItem.callResolve({ type: 'test', value: 'data' })

      expect(manager.handledResults).toHaveLength(1)
      expect(manager.handledResults[0].item).toBe(firstItem)
      expect(manager.handledResults[0].result).toEqual({ type: 'test', value: 'data' })
    })
  })

  describe('handleItemResult', () => {
    it('should receive result when item calls resolve', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      firstItem.callResolve({ type: 'action', value: 'result' })

      expect(manager.handledResults).toHaveLength(1)
      expect(manager.handledResults[0].result).toEqual({ type: 'action', value: 'result' })
    })

    it('should setup resolver on pushed items', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())
      const secondItem = manager.stack[1]

      secondItem.callResolve({ type: 'child-action' })

      expect(manager.handledResults).toHaveLength(1)
      expect(manager.handledResults[0].item).toBe(secondItem)
      expect(manager.handledResults[0].result).toEqual({ type: 'child-action' })
    })
  })

  describe('pushRequest', () => {
    it('should push new item to stack', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())

      expect(manager.stack).toHaveLength(2)
    })

    it('should set pending request on source item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())

      expect(firstItem.hasPendingRequest).toBe(true)
      expect(firstItem.pendingRequest?.payload).toEqual({ query: 'test' })
    })

    it('should pass payload to createItemForRequest', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'find-table' }, jest.fn(), jest.fn())

      expect(manager.lastRequestPayload).toEqual({ query: 'find-table' })
    })
  })

  describe('resolveToParent', () => {
    it('should call resolve callback on parent', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const resolveFn = jest.fn()

      manager.pushRequest(firstItem, { query: 'test' }, resolveFn, jest.fn())
      const selectingItem = manager.stack[1]

      manager.resolveToParent(selectingItem, 'selected-value')

      expect(resolveFn).toHaveBeenCalledWith('selected-value')
    })

    it('should clear pending request on parent', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())
      const selectingItem = manager.stack[1]

      manager.resolveToParent(selectingItem, 'selected-value')

      expect(firstItem.hasPendingRequest).toBe(false)
    })

    it('should remove resolved item and all items after it', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())
      const selectingItem = manager.stack[1]

      manager.resolveToParent(selectingItem, 'selected-value')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0]).toBe(firstItem)
    })

    it('should dispose removed items', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())
      const selectingItem = manager.stack[1]

      manager.resolveToParent(selectingItem, 'selected-value')

      expect(selectingItem.disposed).toBe(true)
    })

    it('should handle nested requests', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const resolve1 = jest.fn()
      const resolve2 = jest.fn()

      manager.pushRequest(firstItem, { query: 'level-1' }, resolve1, jest.fn())
      const level1Item = manager.stack[1]

      manager.pushRequest(level1Item, { query: 'level-2' }, resolve2, jest.fn())
      const level2Item = manager.stack[2]

      expect(manager.stack).toHaveLength(3)

      manager.resolveToParent(level2Item, 'result-2')

      expect(resolve2).toHaveBeenCalledWith('result-2')
      expect(manager.stack).toHaveLength(2)

      manager.resolveToParent(level1Item, 'result-1')

      expect(resolve1).toHaveBeenCalledWith('result-1')
      expect(manager.stack).toHaveLength(1)
    })

    it('should handle three level nesting with correct resolve order', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const resolve0 = jest.fn()
      const resolve1 = jest.fn()
      const resolve2 = jest.fn()

      manager.pushRequest(firstItem, { query: 'level-0' }, resolve0, jest.fn())
      const level1Item = manager.stack[1]

      manager.pushRequest(level1Item, { query: 'level-1' }, resolve1, jest.fn())
      const level2Item = manager.stack[2]

      manager.pushRequest(level2Item, { query: 'level-2' }, resolve2, jest.fn())
      const level3Item = manager.stack[3]

      expect(manager.stack).toHaveLength(4)
      expect(firstItem.hasPendingRequest).toBe(true)
      expect(level1Item.hasPendingRequest).toBe(true)
      expect(level2Item.hasPendingRequest).toBe(true)
      expect(level3Item.hasPendingRequest).toBe(false)

      manager.resolveToParent(level3Item, 'result-3')

      expect(resolve2).toHaveBeenCalledWith('result-3')
      expect(manager.stack).toHaveLength(3)
      expect(level2Item.hasPendingRequest).toBe(false)

      manager.resolveToParent(level2Item, 'result-2')

      expect(resolve1).toHaveBeenCalledWith('result-2')
      expect(manager.stack).toHaveLength(2)
      expect(level1Item.hasPendingRequest).toBe(false)

      manager.resolveToParent(level1Item, 'result-1')

      expect(resolve0).toHaveBeenCalledWith('result-1')
      expect(manager.stack).toHaveLength(1)
      expect(firstItem.hasPendingRequest).toBe(false)
    })
  })

  describe('rejectRequest', () => {
    it('should call reject callback on parent', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const rejectFn = jest.fn()

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), rejectFn)
      const selectingItem = manager.stack[1]

      manager.rejectRequest(selectingItem)

      expect(rejectFn).toHaveBeenCalled()
    })

    it('should clear pending request on parent', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())
      const selectingItem = manager.stack[1]

      manager.rejectRequest(selectingItem)

      expect(firstItem.hasPendingRequest).toBe(false)
    })

    it('should remove all items after the rejecting item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'level-1' }, jest.fn(), jest.fn())
      const level1Item = manager.stack[1]

      manager.pushRequest(level1Item, { query: 'level-2' }, jest.fn(), jest.fn())
      const level2Item = manager.stack[2]

      manager.rejectRequest(level1Item)

      expect(manager.stack).toHaveLength(2)
      expect(level2Item.disposed).toBe(true)
    })
  })

  describe('cancelFromItem', () => {
    it('should remove all items after the specified item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'level-1' }, jest.fn(), jest.fn())
      const level1Item = manager.stack[1]

      manager.pushRequest(level1Item, { query: 'level-2' }, jest.fn(), jest.fn())
      const level2Item = manager.stack[2]

      manager.cancelFromItem(firstItem)

      expect(manager.stack).toHaveLength(1)
      expect(level1Item.disposed).toBe(true)
      expect(level2Item.disposed).toBe(true)
    })

    it('should call reject on pending request of the item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const rejectFn = jest.fn()

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), rejectFn)

      manager.cancelFromItem(firstItem)

      expect(rejectFn).toHaveBeenCalled()
    })

    it('should clear pending request on the item', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())

      manager.cancelFromItem(firstItem)

      expect(firstItem.hasPendingRequest).toBe(false)
    })

    it('should handle item not in stack', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const orphanItem = new TestStackItem()

      expect(() => manager.cancelFromItem(orphanItem)).not.toThrow()
      expect(manager.stack).toHaveLength(1)
    })
  })

  describe('dispose', () => {
    it('should dispose all items in stack', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      manager.pushRequest(firstItem, { query: 'test' }, jest.fn(), jest.fn())
      const level1Item = manager.stack[1]

      manager.dispose()

      expect(firstItem.disposed).toBe(true)
      expect(level1Item.disposed).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle resolveToParent with item not in stack', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)
      const orphanItem = new TestStackItem()

      expect(() => manager.resolveToParent(orphanItem, 'result')).not.toThrow()
    })

    it('should handle deep nesting', () => {
      const firstItem = new TestStackItem()
      const manager = new TestStackManager(firstItem)

      for (let i = 0; i < 5; i++) {
        const currentItem = manager.stack[manager.stack.length - 1]
        manager.pushRequest(currentItem, { query: `level-${i}` }, jest.fn(), jest.fn())
      }

      expect(manager.stack).toHaveLength(6)

      const middleItem = manager.stack[3]
      manager.resolveToParent(middleItem, 'middle-result')

      expect(manager.stack).toHaveLength(3)
    })
  })
})
