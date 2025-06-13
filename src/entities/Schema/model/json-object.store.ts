import { makeAutoObservable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonObjectSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'

export class JsonObjectStore implements JsonObjectSchema {
  public readonly type = JsonSchemaTypeName.Object

  public $ref = ''

  public readOnly?: boolean
  public title?: string
  public description?: string
  public deprecated?: boolean

  public readonly additionalProperties = false
  public readonly required: string[] = []
  public readonly properties: Record<string, JsonSchemaStore> = {}

  private readonly valuesMap: Map<string, JsonObjectValueStore[]> = new Map<string, JsonObjectValueStore[]>()

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public registerValue(value: JsonObjectValueStore): number {
    const length = this.getOrCreateValues(value.rowId).push(value)
    return length - 1
  }

  public getValue(rowId: string, index: number = 0): JsonObjectValueStore | undefined {
    return this.getOrCreateValues(rowId)[index]
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

  public getProperty(name: string): JsonSchemaStore | undefined {
    return this.properties[name]
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

  private getOrCreateValues(rowId: string): JsonObjectValueStore[] {
    let values = this.valuesMap.get(rowId)

    if (!values) {
      values = []
      this.valuesMap.set(rowId, values)
    }

    return values
  }
}
