import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export class JsonStringValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public readonly type = JsonSchemaTypeName.String

  public baseValue: string = ''
  public value: string | null = null

  constructor(private schema: JsonStringStore) {
    makeAutoObservable(this)
  }

  public get reference() {
    return this.schema.reference
  }

  public get touched(): boolean {
    return this.baseValue !== this.value
  }

  public get isValid(): boolean {
    if (this.schema.reference && !this.value) {
      return false
    }

    return true
  }

  public getPlainValue() {
    return this.value ?? this.schema.default
  }

  public setValue(value: string) {
    this.value = value
  }

  public updateBaseValue(data: JsonValue): void {
    this.baseValue = data as unknown as string
    this.value = data as unknown as string
  }
}