import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowUpdatedAtSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
