import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonNumberSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export class JsonNumberStore implements JsonNumberSchema {
  public readonly type = JsonSchemaTypeName.Number

  public default: number = 0

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public getPlainSchema(): JsonNumberSchema {
    return {
      type: this.type,
      default: this.default,
    }
  }
}
