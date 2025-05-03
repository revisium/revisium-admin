import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonBooleanSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export class JsonBooleanStore implements JsonBooleanSchema {
  public readonly type = JsonSchemaTypeName.Boolean

  public $ref = ''

  public default: boolean = false
  public readOnly?: boolean

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public getPlainSchema(): JsonBooleanSchema {
    return {
      type: this.type,
      default: this.default,
    }
  }
}
