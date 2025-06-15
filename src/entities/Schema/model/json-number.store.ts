import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonNumberSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'

export class JsonNumberStore implements JsonNumberSchema {
  public readonly type = JsonSchemaTypeName.Number

  public name: string = ''

  public $ref = ''

  public default: number = 0
  public readOnly?: boolean
  public title?: string
  public description?: string
  public deprecated?: boolean

  private readonly valuesMap: Map<string, JsonNumberValueStore[]> = new Map<string, JsonNumberValueStore[]>()

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public registerValue(value: JsonNumberValueStore): number {
    const length = this.getOrCreateValues(value.rowId).push(value)
    return length - 1
  }

  public getValue(rowId: string, index: number = 0): JsonNumberValueStore | undefined {
    return this.getOrCreateValues(rowId)[index]
  }

  public getPlainSchema(): JsonNumberSchema {
    return {
      type: this.type,
      default: this.default,
    }
  }

  private getOrCreateValues(rowId: string): JsonNumberValueStore[] {
    let values = this.valuesMap.get(rowId)

    if (!values) {
      values = observable([])
      this.valuesMap.set(rowId, values)
    }

    return values
  }
}
