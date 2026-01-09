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

  public baseValue: string

  public readonly index: number

  constructor(
    public readonly schema: JsonStringStore,
    public readonly rowId: string = '',
    public value: string = '',
  ) {
    this.index = this.schema.registerValue(this)

    this.baseValue = this.value

    makeAutoObservable(this, {}, { autoBind: true })
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

  public get foreignKey() {
    return this.schema.foreignKey
  }

  public get contentMediaType() {
    return this.schema.contentMediaType
  }

  public get touched(): boolean {
    return this.baseValue !== this.value
  }

  public get isValid(): boolean {
    return !(this.schema.foreignKey && !this.value)
  }

  public getPlainValue() {
    return this.value ?? this.schema.default
  }

  public setValue(value: string) {
    this.value = value
  }

  public save() {
    this.baseValue = this.value
  }

  public updateBaseValue(data: JsonValue): void {
    this.baseValue = data as unknown as string
    this.value = data as unknown as string
  }

  public updateValue(data: JsonValue): void {
    this.value = data as unknown as string
  }
}
