import { makeAutoObservable } from 'mobx'
import { JsonObjectSchema } from 'src/entities/Schema'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { isValidSchema } from 'src/shared/schema/isValidSchema.ts'

export class RowPageModel {
  constructor(private readonly projectPageModel: ProjectPageModel) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get row() {
    return this.projectPageModel.rowOrThrow
  }

  public get isValidSchema(): boolean {
    const schema = this.projectPageModel.tableOrThrow.schema as JsonObjectSchema

    return isValidSchema(schema)
  }

  public init() {}

  public dispose() {}
}
