import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName, JsonStringSchema } from 'src/entities/Schema'

export class JsonStringStore implements JsonStringSchema {
  public readonly type = JsonSchemaTypeName.String

  public default: string = ''
  public reference?: string

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public getPlainSchema(): JsonStringSchema {
    const schema: JsonStringSchema = {
      type: this.type,
      default: this.default,
    }

    if (this.reference) {
      schema.reference = this.reference
    }

    return schema
  }
}
