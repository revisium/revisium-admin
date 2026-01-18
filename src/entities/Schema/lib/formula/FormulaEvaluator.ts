import { evaluateWithContext } from '@revisium/formula'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonValueStore, JsonValueStorePrimitives } from 'src/entities/Schema/model/value/json-value.store'
import { FormulaField } from './FormulaFieldCollector'
import { FormulaPathResolver } from './FormulaPathResolver'

export interface FormulaEvaluatorOptions {
  onError?: (path: string, error: Error) => void
}

export class FormulaEvaluator {
  constructor(
    private readonly root: JsonValueStore,
    private readonly pathResolver: FormulaPathResolver,
    private readonly options: FormulaEvaluatorOptions = {},
  ) {}

  public evaluate(field: FormulaField): void {
    try {
      const context = this.buildContext(field)
      const result = evaluateWithContext(field.expression, context)
      this.setStoreValue(field.store, result)
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(field.path, error as Error)
      }
      this.setDefaultValue(field.store)
    }
  }

  private buildContext(field: FormulaField): {
    rootData: Record<string, unknown>
    itemData?: Record<string, unknown>
    currentPath?: string
  } {
    const rootData = this.collectRootData()

    if (field.parentPath) {
      const itemData = this.pathResolver.getValueByPath(rootData, field.parentPath) as
        | Record<string, unknown>
        | undefined
      if (itemData && typeof itemData === 'object') {
        return { rootData, itemData, currentPath: field.parentPath }
      }
    }

    return { rootData }
  }

  private collectRootData(): Record<string, unknown> {
    if (this.root.type === JsonSchemaTypeName.Object) {
      return this.collectObjectData(this.root)
    }
    return {}
  }

  private collectObjectData(store: JsonValueStore): Record<string, unknown> {
    if (store.type !== JsonSchemaTypeName.Object) {
      return {}
    }

    const result: Record<string, unknown> = {}

    for (const [key, valueStore] of Object.entries(store.value)) {
      result[key] = this.collectStoreValue(valueStore)
    }

    return result
  }

  private collectStoreValue(store: JsonValueStore): unknown {
    if (store.type === JsonSchemaTypeName.Object) {
      return this.collectObjectData(store)
    } else if (store.type === JsonSchemaTypeName.Array) {
      return store.value.map((item) => this.collectStoreValue(item))
    } else {
      return store.value
    }
  }

  private setStoreValue(store: JsonValueStorePrimitives, value: unknown): void {
    if (store.type === JsonSchemaTypeName.String) {
      store.value = String(value ?? '')
    } else if (store.type === JsonSchemaTypeName.Number) {
      store.value = typeof value === 'number' ? value : Number(value) || 0
    } else if (store.type === JsonSchemaTypeName.Boolean) {
      store.value = Boolean(value)
    }
  }

  private setDefaultValue(store: JsonValueStorePrimitives): void {
    store.value = store.schema.default
  }
}
