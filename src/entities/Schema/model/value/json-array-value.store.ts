import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonArray, JsonValue } from 'src/entities/Schema/types/json.types.ts'

export class JsonArrayValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public isCollapsible = true
  public isCollapsed = false

  public readonly type = JsonSchemaTypeName.Array

  public baseValue: JsonValueStore[] = []

  public index: number

  constructor(
    private readonly schema: JsonArrayStore,
    public readonly rowId: string = '',
    public value: JsonValueStore[] = [],
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

  public get touched(): boolean {
    if (this.value !== this.baseValue) {
      return true
    }

    return this.value.some((item) => item.touched)
  }

  public get isValid(): boolean {
    return this.value.every((item) => item.isValid)
  }

  public get items() {
    return this.schema.items
  }

  public getPlainValue(): JsonArray {
    return this.value.map((item) => item.getPlainValue())
  }

  public createItem() {
    if (this.value === this.baseValue) {
      this.value = this.baseValue.slice()
    }

    const item = createEmptyJsonValueStore(this.schema.items)
    this.value.push(item)
    item.parent = this
    item.id = (this.value.length - 1).toString()

    return item
  }

  public removeItem(index: number) {
    if (this.value === this.baseValue) {
      this.value = this.baseValue.slice()
    }

    const item = this.value[index]
    item.parent = null
    item.id = ''
    this.value.splice(index, 1)
  }

  public updateBaseValue(data: JsonValue): void {
    const itemValues: JsonArray = data as JsonArray

    this.baseValue.length = Math.min(this.baseValue.length, itemValues.length)

    itemValues.forEach((itemValue, index) => {
      let item = this.baseValue[index]

      if (!item) {
        item = createEmptyJsonValueStore(this.schema.items)
        this.baseValue.push(item)
      }

      item.parent = this
      item.id = index.toString()
      item.updateBaseValue(itemValue)
    })

    this.value = this.baseValue
  }

  public updateValue(data: JsonValue): void {
    const itemValues: JsonArray = data as JsonArray

    if (this.value.length !== this.baseValue.length) {
      this.value = this.baseValue.slice()
    }

    this.value.length = Math.min(this.value.length, itemValues.length)

    itemValues.forEach((itemValue, index) => {
      let item = this.value[index]

      if (!item) {
        item = createEmptyJsonValueStore(this.schema.items)
        this.value.push(item)
      }

      item.parent = this
      item.id = index.toString()
      item.updateValue(itemValue)
    })
  }

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed
  }
}
