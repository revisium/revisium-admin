import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowVersionIdSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
