import { JsonSchema, JsonSchemaTypeName, JsonSchemaWithoutRef, schemaRefsMapper } from 'src/entities/Schema'
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
      saveSharedFields(objectNode, schema)

      Object.entries(schema.properties).forEach(([id, schema]) => {
        const propertyNode = createSchemaNode(schema)
        propertyNode.setId(id)
        objectNode.addProperty(propertyNode)
      })

      return objectNode
    }
    case JsonSchemaTypeName.Array: {
      const items = createSchemaNode(schema.items)

      const arrayStore = new ArrayNodeStore(items)
      saveSharedFields(arrayStore, schema)

      return arrayStore
    }
    case JsonSchemaTypeName.String: {
      const stringNode = new StringNodeStore()

      if (schema.foreignKey !== undefined) {
        const stringForeignKeyNode = new StringForeignKeyNodeStore()
        stringForeignKeyNode.setForeignKey(schema.foreignKey)

        stringNode.setForeignKey(stringForeignKeyNode)
      }

      stringNode.setContentMediaType(schema.contentMediaType ?? null)

      saveSharedFields(stringNode, schema)

      return stringNode
    }
    case JsonSchemaTypeName.Number: {
      const numberNode = new NumberNodeStore()
      saveSharedFields(numberNode, schema)
      return numberNode
    }
    case JsonSchemaTypeName.Boolean: {
      const booleanNode = new BooleanNodeStore()
      saveSharedFields(booleanNode, schema)
      return booleanNode
    }
  }
}

export const saveSharedFields = (node: SchemaNode, schema: JsonSchemaWithoutRef) => {
  if (schema.title) {
    node.setTitle(schema.title)
  }

  if (schema.description) {
    node.setDescription(schema.description)
  }

  if (schema.deprecated) {
    node.setDeprecated(schema.deprecated)
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
