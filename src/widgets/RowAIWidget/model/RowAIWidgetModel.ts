import { makeAutoObservable } from 'mobx'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { rowSuggestionMstRequest } from 'src/shared/model/BackendStore/api/rowSuggestionMstRequest.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { PromptEditorModel } from 'src/widgets/RowAIWidget/model/PromptEditorModel.ts'

export class RowAIWidgetModel {
  public isLoading = false
  public prompt: PromptEditorModel

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    public data: JsonValue,
    private readonly rowId: string,
    private readonly onChange: (data: JsonValue) => void,
  ) {
    makeAutoObservable(this)

    this.prompt = new PromptEditorModel()
  }

  async submit() {
    this.setIsLoading(true)
    try {
      const prompt = this.prompt.value
      this.prompt.setValue('')

      const result = await rowSuggestionMstRequest({
        data: {
          data: this.data,
          prompt,
          revisionId: this.projectPageModel.revisionOrThrow.id,
          tableId: this.projectPageModel.tableOrThrow.id,
          rowId: this.rowId,
        },
      })

      this.data = result.rowSuggestion.data
      this.onChange(this.data)
    } catch (error) {
      console.error(error)
    } finally {
      this.setIsLoading(false)
    }
  }

  public init() {}

  public dispose() {}

  public setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading
  }
}
