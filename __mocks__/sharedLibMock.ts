export const container = {
  get: jest.fn(() => ({})),
  register: jest.fn(),
}

export const invariant = (condition: unknown, message: string): asserts condition => {
  if (!condition) {
    throw new Error(message)
  }
}

export { StackItem, StackManager, createStackRequest, createStackContext } from '../src/shared/lib/Stack'
export type { StackRequest } from '../src/shared/lib/Stack'
export { ObservableRequest } from '../src/shared/lib/ObservableRequest'
