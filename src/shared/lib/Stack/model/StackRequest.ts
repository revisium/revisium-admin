import { StackRequest } from './types.ts'

export function createStackRequest<TPayload, TResult>(
  payload: TPayload,
  onResolve: (result: TResult) => void,
  onReject: () => void,
): StackRequest<TPayload, TResult> {
  return {
    payload,
    resolve: onResolve,
    reject: onReject,
  }
}
