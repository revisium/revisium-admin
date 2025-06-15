import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonBooleanStore } from 'src/entities/Schema/model/json-boolean.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export class JsonBooleanValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public readonly type = JsonSchemaTypeName.Boolean

  public baseValue: boolean | null = null

  public readonly index: number

  constructor(
    public readonly schema: JsonBooleanStore,
    public readonly rowId: string = '',
    public value: boolean | null = null,
  ) {
    this.index = this.schema.registerValue(this)

    this.baseValue = this.value ?? null

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

  public getPlainValue() {
    return this.value ?? this.schema.default
  }

  public setValue(value: boolean) {
    this.value = value
  }

  public updateBaseValue(data: JsonValue): void {
    this.baseValue = data as unknown as boolean
    this.value = data as unknown as boolean
  }

  public updateValue(data: JsonValue): void {
    this.value = data as unknown as boolean
  }
}
