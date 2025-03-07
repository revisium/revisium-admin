import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchemaTypeName, ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { IRowModel } from 'src/shared/model/BackendStore'
import { IRowForeignKeysByModel } from 'src/shared/model/BackendStore/model'

export class RowDataCardStore {
  public readonly name = new JsonStringValueStore(new JsonStringStore())
  public readonly root: JsonValueStore

  public overNode: JsonValueStore | null = null
  public viewMode: ViewerSwitcherMode = ViewerSwitcherMode.Tree

  public scrollPosition: number | null = null

  private originData: JsonValue | null = null

  public constructor(
    root: JsonValueStore,
    name: string = nanoid(6),
    public readonly originRow: IRowModel | null = null,
    private originRowRefsBy: IRowForeignKeysByModel | null = null,
  ) {
    this.root = root
    this.name.value = name
    this.originData = this.originRow?.data || null

    this.reset()

    makeAutoObservable(this, {}, { autoBind: true })
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
    return Boolean(this.originRowRefsBy?.countForeignKeysBy)
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
    if (this.originData) {
      this.root.updateBaseValue(this.originData)
    }
  }

  public save() {
    this.originData = this.root.getPlainValue()
    this.root.updateBaseValue(this.originData)
  }
}
