import { nanoid } from 'nanoid'
import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export enum SchemaIds {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Object = 'Object',
  Array = 'Array',
  ReferenceString = 'ReferenceString',
}

type OptionSchemas = { label: string; getSchema: (currentSchema: JsonSchema) => JsonSchema; id: SchemaIds }
type Group = { id: string; label: string; options: OptionSchemas[] }

const typesSchemas: OptionSchemas[] = [
  {
    id: SchemaIds.String,
    label: JsonSchemaTypeName.String,
    getSchema: () => ({
      type: JsonSchemaTypeName.String,
      default: '',
    }),
  },
  {
    id: SchemaIds.Number,
    label: JsonSchemaTypeName.Number,
    getSchema: () => ({
      type: JsonSchemaTypeName.Number,
      default: 0,
    }),
  },
  {
    id: SchemaIds.Boolean,
    label: JsonSchemaTypeName.Boolean,
    getSchema: () => ({
      type: JsonSchemaTypeName.Boolean,
      default: false,
    }),
  },
  {
    id: SchemaIds.Object,
    label: JsonSchemaTypeName.Object,
    getSchema: () => ({
      type: JsonSchemaTypeName.Object,
      properties: {},
      required: [],
      additionalProperties: false,
    }),
  },
  {
    id: SchemaIds.Array,
    label: JsonSchemaTypeName.Array,
    getSchema: (currentSchema) => {
      let items: JsonSchema = {
        type: JsonSchemaTypeName.String,
        default: '',
      }

      if (currentSchema.type === JsonSchemaTypeName.Number) {
        items = currentSchema
      } else if (currentSchema.type === JsonSchemaTypeName.Boolean) {
        items = currentSchema
      } else if (currentSchema.type === JsonSchemaTypeName.String) {
        items = currentSchema
      }

      return {
        type: JsonSchemaTypeName.Array,
        items,
      }
    },
  },
]

const referenceSchemas: OptionSchemas[] = [
  {
    id: SchemaIds.ReferenceString,
    label: JsonSchemaTypeName.String,
    getSchema: (currentSchema) => {
      let schema: JsonSchema = {
        type: JsonSchemaTypeName.String,
        default: '',
        reference: '',
      }

      if (
        currentSchema.type === JsonSchemaTypeName.Array &&
        currentSchema.items.type === JsonSchemaTypeName.String &&
        currentSchema.items.reference !== undefined
      ) {
        schema = currentSchema.items
      }

      return schema
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
    label: 'References',
    options: referenceSchemas,
  },
]

export const getSchemaByMenuId = (id: string, currentSchema: JsonSchema): JsonSchema | undefined => {
  return menuSchemaGroups
    .flatMap((item) => item.options)
    .find((option) => option.id === id)
    ?.getSchema(currentSchema)
}
