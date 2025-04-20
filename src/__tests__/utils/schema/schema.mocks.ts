import {
  JsonArraySchema,
  JsonBooleanSchema,
  JsonNumberSchema,
  JsonObjectSchema,
  JsonSchema,
  JsonSchemaTypeName,
  JsonStringSchema,
} from 'src/entities/Schema'
import {
  JsonPatchAdd,
  JsonPatchMove,
  JsonPatchRemove,
  JsonPatchReplace,
} from 'src/entities/Schema/types/json-patch.types.ts'

export const getReplacePatch = ({ path, value }: { path: string; value: JsonSchema }): JsonPatchReplace => ({
  op: 'replace',
  path,
  value,
})
export const getRemovePatch = ({ path }: { path: string }): JsonPatchRemove => ({
  op: 'remove',
  path,
})
export const getAddPatch = ({ path, value }: { path: string; value: JsonSchema }): JsonPatchAdd => ({
  op: 'add',
  path,
  value,
})
export const getMovePatch = ({ from, path }: { from: string; path: string }): JsonPatchMove => ({
  op: 'move',
  from,
  path,
})
export const getStringSchema = ({
  defaultValue = '',
  foreignKey,
  readOnly,
}: {
  defaultValue?: string
  foreignKey?: string
  readOnly?: boolean
} = {}): JsonStringSchema => {
  const schema: JsonStringSchema = {
    type: JsonSchemaTypeName.String,
    default: defaultValue,
  }

  if (foreignKey) {
    schema.foreignKey = foreignKey
  }

  if (readOnly) {
    schema.readOnly = readOnly
  }

  return schema
}

export const getNumberSchema = (defaultValue: number = 0, readOnly?: boolean): JsonNumberSchema => {
  const schema: JsonNumberSchema = {
    type: JsonSchemaTypeName.Number,
    default: defaultValue,
  }

  if (readOnly) {
    schema.readOnly = readOnly
  }

  return schema
}

export const getBooleanSchema = (defaultValue: boolean = false, readOnly?: boolean): JsonBooleanSchema => {
  const schema: JsonBooleanSchema = {
    type: JsonSchemaTypeName.Boolean,
    default: defaultValue,
  }

  if (readOnly) {
    schema.readOnly = readOnly
  }

  return schema
}

export const getObjectSchema = (properties: Record<string, JsonSchema>): JsonObjectSchema => ({
  type: JsonSchemaTypeName.Object,
  additionalProperties: false,
  required: Object.keys(properties).sort(),
  properties,
})
export const getArraySchema = (items: JsonSchema): JsonArraySchema => ({
  type: JsonSchemaTypeName.Array,
  items,
})
