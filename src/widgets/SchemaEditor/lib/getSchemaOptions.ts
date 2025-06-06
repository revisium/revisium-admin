import { nanoid } from 'nanoid'
import { JsonSchema, JsonSchemaTypeName, JsonRefSchema, JsonStringSchema } from 'src/entities/Schema'
import { getLabelByRef, SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { createSchemaNode } from 'src/widgets/SchemaEditor/lib/createSchemaNode.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'

export enum SchemaIds {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Object = 'Object',
  Array = 'Array',
  ForeignKeyString = 'ForeignKeyString',
  File = 'File',
  RowId = 'RowId',
  RowVersionId = 'RowVersionId',
  RowCreatedId = 'RowCreatedId',
  RowCreatedAt = 'RowCreatedAt',
  RowPublishedAt = 'RowPublishedAt',
  RowUpdatedAt = 'RowUpdatedAt',
  RowHash = 'RowHash',
  RowSchemaHash = 'RowSchemaHash',
  Markdown = 'Markdown',
}

type BaseOption = {
  id: string
  label: string
  type?: 'item' | 'submenu'
}

type OptionSchemas =
  | (BaseOption & {
      type?: 'item'
      addDividerAfter?: boolean
      getSchemaNode: (currentSchema: JsonSchema) => SchemaNode
    })
  | (BaseOption & {
      type: 'submenu'
      items: OptionSchemas[]
    })

type Group = { id: string; label: string; options: OptionSchemas[]; addDividerAfter?: boolean }

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
  {
    id: SchemaIds.ForeignKeyString,
    label: 'foreign key',
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
    id: 'schemas-submenu',
    label: 'Schemas',
    type: 'submenu',
    items: [
      {
        id: SchemaIds.File,
        label: getLabelByRef(SystemSchemaIds.File),
        getSchemaNode: () => {
          const schema: JsonRefSchema = {
            $ref: SystemSchemaIds.File,
          }
          return createSchemaNode(schema)
        },
      },
      {
        id: SchemaIds.Markdown,
        label: 'Markdown',
        getSchemaNode: (currentSchema) => {
          const schema: JsonStringSchema = {
            type: JsonSchemaTypeName.String,
            default: '',
            contentMediaType: 'text/markdown',
          }

          if (!('$ref' in currentSchema) && currentSchema.type === JsonSchemaTypeName.String) {
            schema.default = currentSchema.default
          }

          return createSchemaNode(schema)
        },
      },
    ],
  },
]

const systemFields: OptionSchemas[] = [
  {
    id: 'system-fields-submenu',
    label: 'System fields',
    type: 'submenu',
    items: [
      {
        id: SchemaIds.RowId,
        label: getLabelByRef(SystemSchemaIds.RowId),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowId }),
      },
      {
        id: SchemaIds.RowVersionId,
        label: getLabelByRef(SystemSchemaIds.RowVersionId),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowVersionId }),
      },
      {
        id: SchemaIds.RowCreatedId,
        label: getLabelByRef(SystemSchemaIds.RowCreatedId),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowCreatedId }),
        addDividerAfter: true,
      },
      {
        id: SchemaIds.RowCreatedAt,
        label: getLabelByRef(SystemSchemaIds.RowCreatedAt),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowCreatedAt }),
      },
      {
        id: SchemaIds.RowPublishedAt,
        label: getLabelByRef(SystemSchemaIds.RowPublishedAt),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowPublishedAt }),
      },
      {
        id: SchemaIds.RowUpdatedAt,
        label: getLabelByRef(SystemSchemaIds.RowUpdatedAt),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowUpdatedAt }),
        addDividerAfter: true,
      },
      {
        id: SchemaIds.RowHash,
        label: getLabelByRef(SystemSchemaIds.RowHash),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowHash }),
      },
      {
        id: SchemaIds.RowSchemaHash,
        label: getLabelByRef(SystemSchemaIds.RowSchemaHash),
        getSchemaNode: () => createSchemaNode({ $ref: SystemSchemaIds.RowSchemaHash }),
      },
    ],
  },
]

export const menuSchemaGroups: Group[] = [
  {
    id: nanoid(),
    label: 'Types',
    options: typesSchemas,
    addDividerAfter: true,
  },
  {
    id: nanoid(),
    label: 'Schemas',
    options: schemas,
    addDividerAfter: true,
  },
  {
    id: nanoid(),
    label: 'System fields',
    options: systemFields,
  },
]

export const getSchemaByMenuId = (id: string, currentSchema: JsonSchema): SchemaNode | undefined => {
  const findInOptions = (options: OptionSchemas[]): SchemaNode | undefined => {
    for (const option of options) {
      if (option.type === 'submenu') {
        const found = findInOptions(option.items)
        if (found) return found
      } else if (option.id === id) {
        return option.getSchemaNode(currentSchema)
      }
    }
    return undefined
  }

  for (const group of menuSchemaGroups) {
    const result = findInOptions(group.options)
    if (result) return result
  }

  return undefined
}
