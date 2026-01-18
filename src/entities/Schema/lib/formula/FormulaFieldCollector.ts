import { parseFormula } from '@revisium/formula'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonValueStore, JsonValueStorePrimitives } from 'src/entities/Schema/model/value/json-value.store'
import { FormulaPathResolver } from './FormulaPathResolver'

export interface FormulaField {
  path: string
  expression: string
  store: JsonValueStorePrimitives
  dependencies: string[]
  parentPath: string
}

export interface CollectedData {
  formulaFields: Map<string, FormulaField>
  storeByPath: Map<string, JsonValueStorePrimitives>
  arrays: JsonArrayValueStore[]
}

export class FormulaFieldCollector {
  constructor(private readonly pathResolver: FormulaPathResolver) {}

  public collect(root: JsonValueStore): CollectedData {
    const formulaFields = new Map<string, FormulaField>()
    const storeByPath = new Map<string, JsonValueStorePrimitives>()
    const arrays: JsonArrayValueStore[] = []

    this.traverseAndCollect(root, formulaFields, storeByPath)
    this.collectArrays(root, arrays)

    return { formulaFields, storeByPath, arrays }
  }

  private traverseAndCollect(
    store: JsonValueStore,
    formulaFields: Map<string, FormulaField>,
    storeByPath: Map<string, JsonValueStorePrimitives>,
  ): void {
    if (this.isPrimitiveStore(store)) {
      const path = createJsonValuePathByStore(store)
      storeByPath.set(path, store)

      if (store.formula) {
        const dependencies = this.parseExpression(store.formula.expression)
        const parentPath = this.pathResolver.getParentPath(path)

        formulaFields.set(path, {
          path,
          expression: store.formula.expression,
          store,
          dependencies,
          parentPath,
        })
      }
    } else if (store.type === JsonSchemaTypeName.Object) {
      for (const valueStore of Object.values(store.value)) {
        this.traverseAndCollect(valueStore, formulaFields, storeByPath)
      }
    } else if (store.type === JsonSchemaTypeName.Array) {
      for (const itemStore of store.value) {
        this.traverseAndCollect(itemStore, formulaFields, storeByPath)
      }
    }
  }

  private collectArrays(store: JsonValueStore, arrays: JsonArrayValueStore[]): void {
    if (store.type === JsonSchemaTypeName.Array) {
      arrays.push(store as JsonArrayValueStore)
      for (const itemStore of store.value) {
        this.collectArrays(itemStore, arrays)
      }
    } else if (store.type === JsonSchemaTypeName.Object) {
      for (const valueStore of Object.values(store.value)) {
        this.collectArrays(valueStore, arrays)
      }
    }
  }

  private parseExpression(expression: string): string[] {
    try {
      const result = parseFormula(expression)
      return result.dependencies
    } catch {
      return []
    }
  }

  private isPrimitiveStore(store: JsonValueStore): store is JsonValueStorePrimitives {
    return (
      store.type === JsonSchemaTypeName.String ||
      store.type === JsonSchemaTypeName.Number ||
      store.type === JsonSchemaTypeName.Boolean
    )
  }
}
