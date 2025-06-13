import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName, JsonStringSchema } from 'src/entities/Schema'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'

export class JsonStringStore implements JsonStringSchema {
  public readonly type = JsonSchemaTypeName.String

  public $ref = ''

  public default: string = ''
  public foreignKey?: string
  public contentMediaType?: JsonStringSchema['contentMediaType']
  public readOnly?: boolean
  public title?: string
  public description?: string
  public deprecated?: boolean

  private readonly valuesMap: Map<string, JsonStringValueStore[]> = new Map<string, JsonStringValueStore[]>()

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public registerValue(value: JsonStringValueStore): number {
    const length = this.getOrCreateValues(value.rowId).push(value)
    return length - 1
  }

  public getValue(rowId: string, index: number = 0): JsonStringValueStore | undefined {
    return this.getOrCreateValues(rowId)[index]
  }

  public getPlainSchema(): JsonStringSchema {
    const schema: JsonStringSchema = {
      type: this.type,
      default: this.default,
    }

    if (this.foreignKey) {
      schema.foreignKey = this.foreignKey
    }

    if (this.contentMediaType) {
      schema.contentMediaType = this.contentMediaType
    }

    return schema
  }

  private getOrCreateValues(rowId: string): JsonStringValueStore[] {
    let values = this.valuesMap.get(rowId)

    if (!values) {
      values = observable([])
      this.valuesMap.set(rowId, values)
    }

    return values
  }
}
