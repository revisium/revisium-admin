import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonBooleanSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'

export class JsonBooleanStore implements JsonBooleanSchema {
  public readonly type = JsonSchemaTypeName.Boolean

  public $ref = ''

  public default: boolean = false
  public readOnly?: boolean
  public title?: string
  public description?: string
  public deprecated?: boolean

  private readonly valuesMap: Map<string, JsonBooleanValueStore[]> = new Map<string, JsonBooleanValueStore[]>()

  constructor(public readonly nodeId: string = nanoid()) {
    makeAutoObservable(this)
  }

  public registerValue(value: JsonBooleanValueStore): number {
    const length = this.getOrCreateValues(value.rowId).push(value)
    return length - 1
  }

  public getValue(rowId: string, index: number = 0): JsonBooleanValueStore | undefined {
    return this.getOrCreateValues(rowId)[index]
  }

  public getPlainSchema(): JsonBooleanSchema {
    return {
      type: this.type,
      default: this.default,
    }
  }

  private getOrCreateValues(rowId: string): JsonBooleanValueStore[] {
    let values = this.valuesMap.get(rowId)

    if (!values) {
      values = []
      this.valuesMap.set(rowId, values)
    }

    return values
  }
}
