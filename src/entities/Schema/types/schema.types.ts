export enum JsonSchemaTypeName {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Object = 'object',
  Array = 'array',
}

export type JsonSchemaSharedFields = {
  deprecated?: boolean
  description?: string
  title?: string
}

export type JsonStringSchema = {
  type: JsonSchemaTypeName.String
  default: string
  foreignKey?: string
  readOnly?: boolean
  pattern?: string
  format?: 'date-time' | 'date' | 'time' | 'email' | 'regex'
  contentMediaType?:
    | 'text/plain'
    | 'text/markdown'
    | 'text/html'
    | 'application/json'
    | 'application/schema+json'
    | 'application/yaml'
  enum?: string[]
} & JsonSchemaSharedFields

export type JsonNumberSchema = {
  type: JsonSchemaTypeName.Number
  default: number
  readOnly?: boolean
} & JsonSchemaSharedFields

export type JsonBooleanSchema = {
  type: JsonSchemaTypeName.Boolean
  default: boolean
  readOnly?: boolean
} & JsonSchemaSharedFields

export type JsonSchemaPrimitives = JsonStringSchema | JsonNumberSchema | JsonBooleanSchema

export type JsonObjectSchema = {
  type: JsonSchemaTypeName.Object
  additionalProperties: false
  required: string[]
  properties: Record<string, JsonSchema>
} & JsonSchemaSharedFields

export type JsonArraySchema = {
  type: JsonSchemaTypeName.Array
  items: JsonSchema
} & JsonSchemaSharedFields

export type JsonRefSchema = {
  $ref: string
}

export type JsonSchema = JsonObjectSchema | JsonArraySchema | JsonSchemaPrimitives | JsonRefSchema

export type JsonSchemaWithoutRef = JsonObjectSchema | JsonArraySchema | JsonSchemaPrimitives
