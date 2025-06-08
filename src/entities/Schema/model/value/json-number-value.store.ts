import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonNumberStore } from 'src/entities/Schema/model/json-number.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export class JsonNumberValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public readonly type = JsonSchemaTypeName.Number

  public baseValue: number | null = null
  public value: number | null = null

  constructor(private readonly schema: JsonNumberStore) {
    makeAutoObservable(this)
  }

  public get $ref() {
    return this.schema.$ref
  }

  public get readOnly() {
    return this.schema.readOnly
  }

  public get title() {
    return this.schema.title
  }

  public get description() {
    return this.schema.description
  }

  public get deprecated() {
    return this.schema.deprecated
  }

  public get touched(): boolean {
    return this.baseValue !== this.value
  }

  public get isValid(): boolean {
    return true
  }

  public get default() {
    return this.schema.default
  }

  public getPlainValue() {
    return this.value ?? this.default
  }

  public setValue(value: number) {
    this.value = value
  }

  public updateBaseValue(data: JsonValue): void {
    this.baseValue = data as unknown as number
    this.value = data as unknown as number
  }

  public updateValue(data: JsonValue): void {
    this.value = data as unknown as number
  }
}
