import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore.ts'
import { JsonObject, JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export class JsonObjectValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public readonly type = JsonSchemaTypeName.Object

  public value: Record<string, JsonValueStore> = {}

  constructor(private readonly schema: JsonObjectStore) {
    makeAutoObservable(this)

    this.init()
  }

  public get $ref() {
    return this.schema.$ref
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
    return Object.values(this.value).some((store) => store.touched)
  }

  public get isValid(): boolean {
    return Object.values(this.value).every((item) => item.isValid)
  }

  public getPlainValue(): JsonObject {
    return Object.entries(this.value).reduce<Record<string, JsonValue>>((result, [name, store]) => {
      result[name] = store.getPlainValue() as JsonValue
      return result
    }, {})
  }

  public updateBaseValue(data: JsonValue): void {
    Object.entries(this.value).map(([name, store]) => {
      if (name in (data as unknown as object)) {
        store.updateBaseValue((data as unknown as object)[name])
      }
    })
  }

  private init(): void {
    Object.entries(this.schema.properties).forEach(([id, schema]) => {
      const item = createJsonValueStore(schema)
      item.parent = this
      item.id = id
      this.value[id] = item
    })
  }
}
