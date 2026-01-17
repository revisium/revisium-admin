import { JsonSchema, JsonSchemaPrimitives } from 'src/entities/Schema'

type SharedFieldsState = {
  title: string
  description: string
  deprecated: boolean
  formula?: string
}

export const addSharedFieldsFromState = <T extends JsonSchema = JsonSchema>(schema: T, state: SharedFieldsState): T => {
  if (state.title) {
    schema.title = state.title
  }

  if (state.description) {
    schema.description = state.description
  }

  if (state.deprecated) {
    schema.deprecated = state.deprecated
  }

  if (state.formula && isPrimitiveSchema(schema)) {
    const primitiveSchema = schema as JsonSchemaPrimitives
    primitiveSchema['x-formula'] = {
      version: 1,
      expression: state.formula,
    }
    primitiveSchema.readOnly = true
  }

  return schema
}

function isPrimitiveSchema(schema: JsonSchema): schema is JsonSchemaPrimitives {
  return 'type' in schema && ['string', 'number', 'boolean'].includes(schema.type)
}
