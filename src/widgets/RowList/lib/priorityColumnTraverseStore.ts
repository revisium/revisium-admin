import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'

const getSortPriority = (schema: JsonSchemaStore): number => {
  if (schema.$ref === SystemSchemaIds.File) {
    return 1
  }

  if (!schema.$ref) {
    if (schema.type === JsonSchemaTypeName.String && !schema.foreignKey) {
      return 2
    }
    if (schema.type === JsonSchemaTypeName.Number) {
      return 3
    }
    if (schema.type === JsonSchemaTypeName.Boolean) {
      return 4
    }
  }

  if (schema.type === JsonSchemaTypeName.String && schema.foreignKey) {
    return 5
  }

  if (schema.$ref) {
    return 6
  }

  if (schema.type === JsonSchemaTypeName.Object || schema.type === JsonSchemaTypeName.Array) {
    return 7
  }

  return 8
}

export const internalPriorityColumnTraverseStore = (
  store: JsonSchemaStore,
  callback: (node: JsonSchemaStore) => boolean | void,
) => {
  if (store.type === JsonSchemaTypeName.Object) {
    const properties: { key: string; schema: JsonSchemaStore }[] = Object.entries(store.properties).map(
      ([key, schema]) => ({ key, schema }),
    )

    properties.sort((a, b) => {
      const priorityA = getSortPriority(a.schema)
      const priorityB = getSortPriority(b.schema)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      return a.key.localeCompare(b.key)
    })

    const notSkipped: JsonSchemaStore[] = []

    properties.forEach(({ schema }) => {
      const needToSkip = callback(schema)

      if (!needToSkip) {
        notSkipped.push(schema)
      }
    })

    notSkipped.forEach((item) => {
      internalPriorityColumnTraverseStore(item, callback)
    })
  } else if (store.type === JsonSchemaTypeName.Array) {
    internalPriorityColumnTraverseStore(store.items, callback)
  }
}

export const priorityColumnTraverseStore = (
  store: JsonSchemaStore,
  callback: (node: JsonSchemaStore) => boolean | void,
) => {
  const needToSkip = callback(store)

  if (!needToSkip) {
    internalPriorityColumnTraverseStore(store, callback)
  }
}
