import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowCreatedIdSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
