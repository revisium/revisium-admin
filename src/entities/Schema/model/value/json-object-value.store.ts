import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { JsonObject, JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export class JsonObjectValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public isCollapsed = false

  public readonly type = JsonSchemaTypeName.Object

  public value: Record<string, JsonValueStore> = {}
  public index: number

  constructor(
    public readonly schema: JsonObjectStore,
    public readonly rowId: string = '',
    value: Record<string, JsonValueStore> | null = null,
  ) {
    this.index = this.schema.registerValue(this)

    makeAutoObservable(this, {}, { autoBind: true })

    if (value) {
      this.value = value
    } else {
      Object.entries(this.schema.properties).forEach(([id, schema]) => {
        const item = createEmptyJsonValueStore(schema)
        item.parent = this
        item.id = id
        this.value[id] = item
      })
    }

    this.init()
  }

  public get isCollapsible() {
    return Object.keys(this.schema.properties).length > 0
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

  public save() {
    Object.values(this.value).forEach((store) => {
      store.save()
    })
  }

  public updateBaseValue(data: JsonValue): void {
    Object.entries(this.value).forEach(([name, store]) => {
      if (name in (data as unknown as object)) {
        store.updateBaseValue((data as unknown as object)[name])
      }
    })
  }

  public updateValue(data: JsonValue): void {
    Object.entries(this.value).forEach(([name, store]) => {
      if (name in (data as unknown as object)) {
        store.updateValue((data as unknown as object)[name])
      }
    })
  }

  private init(): void {
    if (this.$ref) {
      this.isCollapsed = true
    }
  }

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed
  }
}
