import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowIdSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
