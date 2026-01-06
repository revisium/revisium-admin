import { StackItem } from '../model/StackItem.ts'
import { StackRequest } from '../model/types.ts'

interface TestState {
  value: string
}

class TestStackItem extends StackItem<TestState> {
  constructor(state: TestState = { value: 'initial' }) {
    super(state)
  }
}

describe('StackItem', () => {
  describe('initialization', () => {
    it('should create with initial state', () => {
      const item = new TestStackItem({ value: 'test' })

      expect(item.state).toEqual({ value: 'test' })
    })

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

  describe('state management', () => {
    it('should allow state updates', () => {
      const item = new TestStackItem({ value: 'initial' })

      item.state = { value: 'updated' }

      expect(item.state).toEqual({ value: 'updated' })
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
