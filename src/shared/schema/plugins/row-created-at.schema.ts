import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowCreatedAtSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
