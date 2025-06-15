import { makeAutoObservable, observable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonArraySchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'

export class JsonArrayStore implements JsonArraySchema {
  public readonly type = JsonSchemaTypeName.Array

  public name: string = ''

  public $ref = ''

  public readOnly?: boolean
  public title?: string
  public description?: string
  public deprecated?: boolean

  private readonly valuesMap: Map<string, JsonArrayValueStore[]> = new Map<string, JsonArrayValueStore[]>()

  constructor(
    public readonly items: JsonSchemaStore,
    public readonly nodeId: string = nanoid(),
  ) {
    makeAutoObservable(this)
  }

  public registerValue(value: JsonArrayValueStore): number {
    const length = this.getOrCreateValues(value.rowId).push(value)
    return length - 1
  }

  public getValue(rowId: string, index: number = 0): JsonArrayValueStore | undefined {
    return this.getOrCreateValues(rowId)[index]
  }

  public getPlainSchema(): JsonArraySchema {
    return toJS({
      type: this.type,
      items: this.items.getPlainSchema(),
    })
  }

  private getOrCreateValues(rowId: string): JsonArrayValueStore[] {
    let values = this.valuesMap.get(rowId)

    if (!values) {
      values = observable([])
      this.valuesMap.set(rowId, values)
    }

    return values
  }
}
