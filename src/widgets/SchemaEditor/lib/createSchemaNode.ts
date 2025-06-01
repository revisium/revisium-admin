import { JsonSchema, JsonSchemaTypeName, schemaRefsMapper } from 'src/entities/Schema'
import { forEachDraftNode } from 'src/widgets/SchemaEditor/lib/traverseNode.ts'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { BooleanNodeStore } from 'src/widgets/SchemaEditor/model/BooleanNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { NumberNodeStore } from 'src/widgets/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'

export const DEFAULT_COLLAPSE_COMPLEXITY = 14

const internalCreateSchemaNode = (schema: JsonSchema): SchemaNode => {
  if ('$ref' in schema) {
    const refSchema = schemaRefsMapper[schema.$ref] as JsonSchema | undefined

    if (!refSchema) {
      throw new Error(`Schema refs must be defined ref$=${schema.$ref}`)
    }

    const node = internalCreateSchemaNode(refSchema)
    node.$ref = schema.$ref
    return node
  }

  switch (schema.type) {
    case JsonSchemaTypeName.Object: {
      const objectNode = new ObjectNodeStore()

      Object.entries(schema.properties).forEach(([id, schema]) => {
        const propertyNode = createSchemaNode(schema)
        propertyNode.setId(id)
        objectNode.addProperty(propertyNode)
      })

      return objectNode
    }
    case JsonSchemaTypeName.Array: {
      const items = createSchemaNode(schema.items)
      return new ArrayNodeStore(items)
    }
    case JsonSchemaTypeName.String: {
      const stringNode = new StringNodeStore()

      if (schema.foreignKey !== undefined) {
        const stringForeignKeyNode = new StringForeignKeyNodeStore()
        stringForeignKeyNode.setForeignKey(schema.foreignKey)

        stringNode.setForeignKey(stringForeignKeyNode)
      }

      stringNode.setContentMediaType(schema.contentMediaType ?? null)

      return stringNode
    }
    case JsonSchemaTypeName.Number: {
      return new NumberNodeStore()
    }
    case JsonSchemaTypeName.Boolean: {
      return new BooleanNodeStore()
    }
  }
}

export const createSchemaNode = (
  schema: JsonSchema,
  options?: { collapse?: boolean; collapseComplexity?: number },
): SchemaNode => {
  const node = internalCreateSchemaNode(schema)

  collapseRefs(node)

  if (options?.collapse) {
    const countNodes = getCountNodes(node)
    const max = options.collapseComplexity ?? DEFAULT_COLLAPSE_COMPLEXITY

    if (countNodes >= max) {
      collapseNode(node)
    }
  }

  return node
}

export const collapseRefs = (node: SchemaNode) => {
  forEachDraftNode(node, (item) => {
    if (item.isCollapsible && Boolean(item.$ref)) {
      item.isCollapsed = true
    }
    return true
  })
}

export const collapseNode = (node: SchemaNode) => {
  forEachDraftNode(node, (item) => {
    if (item.isCollapsible) {
      item.isCollapsed = true
    }
    return true
  })
}

export const getCountNodes = (node: SchemaNode) => {
  let count = 1

  forEachDraftNode(node, () => {
    count += 1
    return true
  })

  return count
}
