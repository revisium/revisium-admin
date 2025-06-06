import { JsonStringSchema, JsonSchemaTypeName } from 'src/entities/Schema'

export const rowPublishedAtSchema: JsonStringSchema = {
  type: JsonSchemaTypeName.String,
  default: '',
}
