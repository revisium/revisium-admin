/* eslint-disable @typescript-eslint/no-explicit-any */

import { makeAutoObservable } from 'mobx'

export class FormState<T extends Record<string, any>> {
  values: T

  constructor(initialValues: T) {
    this.values = initialValues
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public setValue<K extends keyof T>(field: K, value: T[K]) {
    this.values[field] = value
  }

  public get isValid() {
    return Object.values(this.values).every((value) => Boolean(value))
  }
}
