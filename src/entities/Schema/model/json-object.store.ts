import { makeAutoObservable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonObjectSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'

export class JsonObjectStore implements JsonObjectSchema {
  public readonly type = JsonSchemaTypeName.Object

  public $ref = ''

  public readOnly?: boolean

  public readonly additionalProperties = false
  public readonly required: string[] = []
  public readonly properties: Record<string, JsonSchemaStore> = {}

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public get empty(): boolean {
    return Object.keys(this.properties).length === 0
  }

  public addPropertyWithStore(name: string, store: JsonSchemaStore) {
    if (this.properties[name] || this.required.includes(name)) {
      throw new Error('this name already exists')
    }

    this.required.push(name)
    return (this.properties[name] = store)
  }

  public getPlainSchema(): JsonObjectSchema {
    return toJS({
      type: this.type,
      additionalProperties: this.additionalProperties,
      required: toJS(this.required).sort(),
      properties: Object.entries(this.properties).reduce((result, [name, store]) => {
        result[name] = store.getPlainSchema()
        return result
      }, {}),
    })
  }
}
