import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowHashSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
