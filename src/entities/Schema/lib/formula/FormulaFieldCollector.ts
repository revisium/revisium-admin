import { ArrayContext, parseFormula } from '@revisium/formula'
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
  arrayContext?: ArrayContext
}

export interface CollectedData {
  formulaFields: Map<string, FormulaField>
  storeByPath: Map<string, JsonValueStorePrimitives>
  arrays: JsonArrayValueStore[]
}

interface ArrayLevel {
  array: JsonArrayValueStore
  index: number
}

export class FormulaFieldCollector {
  constructor(private readonly pathResolver: FormulaPathResolver) {}

  public collect(root: JsonValueStore): CollectedData {
    const formulaFields = new Map<string, FormulaField>()
    const storeByPath = new Map<string, JsonValueStorePrimitives>()
    const arrays: JsonArrayValueStore[] = []

    this.traverseAndCollect(root, formulaFields, storeByPath, [])
    this.collectArrays(root, arrays)

    return { formulaFields, storeByPath, arrays }
  }

  private traverseAndCollect(
    store: JsonValueStore,
    formulaFields: Map<string, FormulaField>,
    storeByPath: Map<string, JsonValueStorePrimitives>,
    arrayStack: ArrayLevel[],
  ): void {
    if (this.isPrimitiveStore(store)) {
      const path = createJsonValuePathByStore(store)
      storeByPath.set(path, store)

      if (store.formula) {
        const dependencies = this.parseExpression(store.formula.expression)
        const parentPath = this.pathResolver.getParentPath(path)
        const arrayContext = this.buildArrayContext(arrayStack)

        formulaFields.set(path, {
          path,
          expression: store.formula.expression,
          store,
          dependencies,
          parentPath,
          arrayContext,
        })
      }
    } else if (store.type === JsonSchemaTypeName.Object) {
      for (const valueStore of Object.values(store.value)) {
        this.traverseAndCollect(valueStore, formulaFields, storeByPath, arrayStack)
      }
    } else if (store.type === JsonSchemaTypeName.Array) {
      const arrayStore = store as JsonArrayValueStore
      for (let i = 0; i < arrayStore.value.length; i++) {
        const itemStore = arrayStore.value[i]
        const newStack = [...arrayStack, { array: arrayStore, index: i }]
        this.traverseAndCollect(itemStore, formulaFields, storeByPath, newStack)
      }
    }
  }

  private buildArrayContext(arrayStack: ArrayLevel[]): ArrayContext | undefined {
    if (arrayStack.length === 0) {
      return undefined
    }

    return {
      levels: arrayStack.map((level) => {
        const { array, index } = level
        const length = array.value.length
        const prev = index > 0 ? (array.value[index - 1].getPlainValue() as Record<string, unknown>) : null
        const next = index < length - 1 ? (array.value[index + 1].getPlainValue() as Record<string, unknown>) : null

        return { index, length, prev, next }
      }),
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
