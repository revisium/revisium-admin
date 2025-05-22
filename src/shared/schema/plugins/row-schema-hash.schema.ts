import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowSchemaHashSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
  readOnly: true,
}
