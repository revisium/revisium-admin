/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IViewModel {
  init: (...args: any[]) => void
  dispose: () => void
}
