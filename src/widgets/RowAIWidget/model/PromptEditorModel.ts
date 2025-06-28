import { makeAutoObservable } from 'mobx'

export class PromptEditorModel {
  public value = ''

  constructor() {
    makeAutoObservable(this)
  }

  public setValue(value: string) {
    this.value = value
  }
}
