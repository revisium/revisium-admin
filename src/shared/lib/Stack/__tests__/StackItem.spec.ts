import { StackItem } from '../model/StackItem.ts'
import { StackRequest } from '../model/types.ts'

interface TestResult {
  action: string
  value?: string
}

class TestStackItem extends StackItem<TestResult> {
  public callResolve(result: TestResult): void {
    this.resolve(result)
  }
}

describe('StackItem', () => {
  describe('initialization', () => {
    it('should generate unique id', () => {
      const item1 = new TestStackItem()
      const item2 = new TestStackItem()

      expect(item1.id).toBeDefined()
      expect(item2.id).toBeDefined()
      expect(item1.id).not.toEqual(item2.id)
    })

    it('should have no pending request initially', () => {
      const item = new TestStackItem()

      expect(item.hasPendingRequest).toBe(false)
      expect(item.pendingRequest).toBeNull()
    })
  })

  describe('resolver', () => {
    it('should call resolver when resolve is called', () => {
      const item = new TestStackItem()
      const resolver = jest.fn()

      item.setResolver(resolver)
      item.callResolve({ action: 'test', value: 'data' })

      expect(resolver).toHaveBeenCalledWith({ action: 'test', value: 'data' })
    })

    it('should not throw if resolver is not set', () => {
      const item = new TestStackItem()

      expect(() => item.callResolve({ action: 'test' })).not.toThrow()
    })

    it('should allow changing resolver', () => {
      const item = new TestStackItem()
      const resolver1 = jest.fn()
      const resolver2 = jest.fn()

      item.setResolver(resolver1)
      item.callResolve({ action: 'first' })

      item.setResolver(resolver2)
      item.callResolve({ action: 'second' })

      expect(resolver1).toHaveBeenCalledWith({ action: 'first' })
      expect(resolver2).toHaveBeenCalledWith({ action: 'second' })
    })
  })

  describe('pending request', () => {
    it('should set pending request', () => {
      const item = new TestStackItem()
      const request: StackRequest<string, number> = {
        payload: 'test-payload',
        resolve: jest.fn(),
        reject: jest.fn(),
      }

      item.setPendingRequest(request)

      expect(item.hasPendingRequest).toBe(true)
      expect(item.pendingRequest?.payload).toBe(request.payload)
    })

    it('should clear pending request', () => {
      const item = new TestStackItem()
      const request: StackRequest<string, number> = {
        payload: 'test-payload',
        resolve: jest.fn(),
        reject: jest.fn(),
      }

      item.setPendingRequest(request)
      item.clearPendingRequest()

      expect(item.hasPendingRequest).toBe(false)
      expect(item.pendingRequest).toBeNull()
    })

    it('should allow accessing request payload and callbacks', () => {
      const item = new TestStackItem()
      const resolveFn = jest.fn()
      const rejectFn = jest.fn()
      const request: StackRequest<string, number> = {
        payload: 'test-payload',
        resolve: resolveFn,
        reject: rejectFn,
      }

      item.setPendingRequest(request)

      expect(item.pendingRequest?.payload).toBe('test-payload')

      item.pendingRequest?.resolve(42)
      expect(resolveFn).toHaveBeenCalledWith(42)

      item.pendingRequest?.reject()
      expect(rejectFn).toHaveBeenCalled()
    })
  })

  describe('lifecycle', () => {
    it('should have init method', () => {
      const item = new TestStackItem()

      expect(() => item.init()).not.toThrow()
    })

    it('should have dispose method', () => {
      const item = new TestStackItem()

      expect(() => item.dispose()).not.toThrow()
    })
  })
})
