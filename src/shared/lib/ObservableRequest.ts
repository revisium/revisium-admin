/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientError } from 'graphql-request'
import { makeAutoObservable } from 'mobx'
import { Either } from 'src/shared/lib/Either.ts'

type FetchFunction<T, A extends any[]> = (...args: A) => Promise<T>
type Options = { skipResetting?: boolean }

export class AbortError extends Error {
  constructor() {
    super('Aborted')
    this.name = 'AbortError'
  }
}

export class ObservableRequest<T, Args extends any[], E extends ClientError> {
  private _data: T | null = null
  private _error: E | null = null
  private _isLoading: boolean = false
  private _isLoaded: boolean = false
  private _abortController: AbortController | null = null

  public static of<T, Args extends any[], E extends ClientError>(
    fetchFunction: FetchFunction<T, Args>,
    options?: Options,
  ) {
    return new ObservableRequest<T, Args, E>(fetchFunction, options)
  }

  constructor(
    private readonly fetchFunction: FetchFunction<T, Args>,
    private readonly options?: Options,
  ) {
    makeAutoObservable(this)
  }

  public get data(): T | null {
    return this._data
  }

  public get isLoading(): boolean {
    return this._isLoading
  }

  public get isLoaded(): boolean {
    return this._isLoaded
  }

  public get error(): E | null {
    return this._error
  }

  public get errorMessage() {
    return this._error?.response.errors?.[0].message
  }

  public abort(): void {
    this._abortController?.abort()
    this._abortController = null
  }

  public async fetch(...args: Args): Promise<Either<E | AbortError, T>> {
    this.abort()
    this._abortController = new AbortController()
    const signal = this._abortController.signal

    if (!this.options?.skipResetting) {
      this.reset()
    }

    try {
      this.setIsLoading(true)

      const result = await this.fetchFunction(...args)

      if (signal.aborted) {
        return {
          isRight: false,
          error: new AbortError() as E | AbortError,
        }
      }

      this.setData(result)

      return {
        isRight: true,
        data: result,
      }
    } catch (e) {
      if (signal.aborted) {
        return {
          isRight: false,
          error: new AbortError() as E | AbortError,
        }
      }

      console.error(e)
      this.setError(e as E)

      return {
        isRight: false,
        error: e as E,
      }
    } finally {
      this.setIsLoading(false)
      this.setIsLoaded(true)
    }
  }

  private reset() {
    this.setIsLoading(false)
    this.setData(null)
    this.setError(null)
  }

  private setData(value: T | null): void {
    this._data = value
  }

  private setIsLoading(value: boolean) {
    this._isLoading = value
  }

  private setIsLoaded(value: boolean) {
    this._isLoaded = value
  }

  private setError(value: E | null): void {
    this._error = value
  }
}
