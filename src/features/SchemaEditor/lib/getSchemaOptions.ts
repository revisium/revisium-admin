import { nanoid } from 'nanoid'
import { JsonSchema, JsonSchemaTypeName, JsonRefSchema } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'

export enum SchemaIds {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Object = 'Object',
  Array = 'Array',
  ForeignKeyString = 'ForeignKeyString',
  File = 'File',
}

type OptionSchemas = { label: string; getSchemaNode: (currentSchema: JsonSchema) => SchemaNode; id: SchemaIds }
type Group = { id: string; label: string; options: OptionSchemas[] }

const typesSchemas: OptionSchemas[] = [
  {
    id: SchemaIds.String,
    label: JsonSchemaTypeName.String,
    getSchemaNode: () =>
      createSchemaNode({
        type: JsonSchemaTypeName.String,
        default: '',
      }),
  },
  {
    id: SchemaIds.Number,
    label: JsonSchemaTypeName.Number,
    getSchemaNode: () =>
      createSchemaNode({
        type: JsonSchemaTypeName.Number,
        default: 0,
      }),
  },
  {
    id: SchemaIds.Boolean,
    label: JsonSchemaTypeName.Boolean,
    getSchemaNode: () =>
      createSchemaNode({
        type: JsonSchemaTypeName.Boolean,
        default: false,
      }),
  },
  {
    id: SchemaIds.Object,
    label: JsonSchemaTypeName.Object,
    getSchemaNode: () =>
      createSchemaNode({
        type: JsonSchemaTypeName.Object,
        properties: {},
        required: [],
        additionalProperties: false,
      }),
  },
  {
    id: SchemaIds.Array,
    label: JsonSchemaTypeName.Array,
    getSchemaNode: (currentSchema) => {
      let items: JsonSchema = {
        type: JsonSchemaTypeName.String,
        default: '',
      }

      if (!('$ref' in currentSchema)) {
        if (currentSchema.type === JsonSchemaTypeName.Number) {
          items = currentSchema
        } else if (currentSchema.type === JsonSchemaTypeName.Boolean) {
          items = currentSchema
        } else if (currentSchema.type === JsonSchemaTypeName.String) {
          items = currentSchema
        }
      }

      return createSchemaNode({
        type: JsonSchemaTypeName.Array,
        items,
      })
    },
  },
]

const foreignKeySchemas: OptionSchemas[] = [
  {
    id: SchemaIds.ForeignKeyString,
    label: JsonSchemaTypeName.String,
    getSchemaNode: (currentSchema) => {
      let schema: JsonSchema = {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: '',
      }

      if (
        !('$ref' in currentSchema) &&
        currentSchema.type === JsonSchemaTypeName.Array &&
        !('$ref' in currentSchema.items) &&
        currentSchema.items.type === JsonSchemaTypeName.String &&
        currentSchema.items.foreignKey !== undefined
      ) {
        schema = currentSchema.items
      }

      return createSchemaNode(schema)
    },
  },
]

const schemas: OptionSchemas[] = [
  {
    id: SchemaIds.File,
    label: 'File',
    getSchemaNode: () => {
      const schema: JsonRefSchema = {
        $ref: SystemSchemaIds.File,
      }
      return createSchemaNode(schema)
    },
  },
]

export const menuSchemaGroups: Group[] = [
  {
    id: nanoid(),
    label: 'Types',
    options: typesSchemas,
  },
  {
    id: nanoid(),
    label: 'Link to table',
    options: foreignKeySchemas,
  },
  {
    id: nanoid(),
    label: 'Schemas',
    options: schemas,
  },
]

export const getSchemaByMenuId = (id: string, currentSchema: JsonSchema): SchemaNode | undefined => {
  return menuSchemaGroups
    .flatMap((item) => item.options)
    .find((option) => option.id === id)
    ?.getSchemaNode(currentSchema)
}
