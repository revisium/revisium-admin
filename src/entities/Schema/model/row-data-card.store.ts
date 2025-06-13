import { makeAutoObservable } from 'mobx'
import { JsonSchemaTypeName, ViewerSwitcherMode } from 'src/entities/Schema'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { traverseValue } from 'src/entities/Schema/lib/traverseValue.ts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { IRowModel } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RowDataCardStore {
  public readonly name = new JsonStringValueStore(new JsonStringStore())
  public readonly root: JsonValueStore

  public overNode: JsonValueStore | null = null
  public viewMode: ViewerSwitcherMode = ViewerSwitcherMode.Tree

  public scrollPosition: number | null = null

  private originData: JsonValue | null = null

  public constructor(
    public readonly schemaStore: JsonSchemaStore,
    root: JsonValueStore,
    name: string,
    public readonly originRow: IRowModel | null = null,
    private readonly projectPageModel?: ProjectPageModel,
  ) {
    this.root = root
    this.name.baseValue = name
    this.name.value = name
    this.originData = this.originRow?.data ?? null

    this.reset()

    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get touched() {
    return this.root.touched || this.name.touched
  }

  public get isValid() {
    return this.root.isValid || this.name.isValid
  }

  public get isComplexStructure(): boolean {
    // TODO count properties
    if (this.root.type === JsonSchemaTypeName.Object) {
      return Object.values(this.root.value).some(
        (value) => value.type === JsonSchemaTypeName.Object || value.type === JsonSchemaTypeName.Array,
      )
    } else if (this.root.type === JsonSchemaTypeName.Array) {
      return this.root.items.type === JsonSchemaTypeName.Object || this.root.items.type === JsonSchemaTypeName.Array
    }

    return false
  }

  public get areThereForeignKeysBy(): boolean {
    return Boolean(this.projectPageModel?.rowRefsBy?.countForeignKeysBy)
  }

  public setOverNode(value: JsonValueStore | null): void {
    this.overNode = value
  }

  public setViewMode(value: ViewerSwitcherMode): void {
    this.viewMode = value
  }

  public setScrollPosition(value: number | null): void {
    this.scrollPosition = value
  }

  public reset() {
    if (this.originData !== null) {
      this.root.updateBaseValue(this.originData)
      this.name.value = this.name.baseValue
    }
  }

  public syncReadOnlyStores() {
    if (this.originRow?.data) {
      const readOnlyStores = new Map<string, JsonValueStore>()

      traverseValue(this.root, (value) => {
        if (value.readOnly) {
          readOnlyStores.set(createJsonValuePathByStore(value), value)
        }
      })

      const nextData = createEmptyJsonValueStore(this.schemaStore)
      nextData.updateBaseValue(this.originRow.data)

      traverseValue(nextData, (value) => {
        if (value.readOnly) {
          const readOnlyStore = readOnlyStores.get(createJsonValuePathByStore(value))
          if (readOnlyStore) {
            readOnlyStore.updateBaseValue(value.getPlainValue())
          }
        }
      })
    }
  }

  public save() {
    this.originData = this.root.getPlainValue()
    this.root.updateBaseValue(this.originData)
    this.name.updateBaseValue(this.name.value)
  }

  public updateValue(value: JsonValue) {
    this.root.updateValue(value)
  }
}
