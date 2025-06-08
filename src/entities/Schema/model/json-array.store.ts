import { makeAutoObservable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonArraySchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'

export class JsonArrayStore implements JsonArraySchema {
  public readonly type = JsonSchemaTypeName.Array

  public $ref = ''

  public readOnly?: boolean
  public title?: string
  public description?: string
  public deprecated?: boolean

  constructor(
    public readonly items: JsonSchemaStore,
    public readonly nodeId: string = nanoid(),
  ) {
    makeAutoObservable(this)
  }

  public getPlainSchema(): JsonArraySchema {
    return toJS({
      type: this.type,
      items: this.items.getPlainSchema(),
    })
  }
}
