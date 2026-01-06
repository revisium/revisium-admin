export interface StackRequest<TPayload, TResult> {
  payload: TPayload
  resolve: (result: TResult) => void
  reject: () => void
}
