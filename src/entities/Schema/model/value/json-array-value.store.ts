import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonArray, JsonValue } from 'src/entities/Schema/types/json.types.ts'

export class JsonArrayValueStore {
  public id: string = ''
  public parent: JsonValueStore | null = null
  public readonly nodeId: string = nanoid()

  public readonly type = JsonSchemaTypeName.Array

  public baseValue: JsonValueStore[] = []
  public value: JsonValueStore[] = []

  constructor(private schema: JsonArrayStore) {
    makeAutoObservable(this)
  }

  public get $ref() {
    return this.schema.$ref
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

    const item = createJsonValueStore(this.schema.items)
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
    this.baseValue.length = 0

    const itemValues: JsonArray = data as JsonArray

    itemValues.forEach((itemValue, index) => {
      const item = createJsonValueStore(this.schema.items)
      item.parent = this
      item.id = index.toString()
      item.updateBaseValue(itemValue)
      this.baseValue.push(item)
    })

    this.value = this.baseValue
  }
}
