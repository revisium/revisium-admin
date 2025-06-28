import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { PromptEditorModel } from 'src/widgets/RowAIWidget/model/PromptEditorModel.ts'

export class RowAIWidgetModel {
  public prompt: PromptEditorModel

  constructor() {
    makeAutoObservable(this)

    this.prompt = new PromptEditorModel()
  }

  public init() {}

  public dispose() {}
}

container.register(
  RowAIWidgetModel,
  () => {
    return new RowAIWidgetModel()
  },
  { scope: 'request' },
)
