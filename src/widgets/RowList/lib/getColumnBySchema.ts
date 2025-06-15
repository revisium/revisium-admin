import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'

export const getColumnBySchema = (schema: JsonSchemaStore): number => {
  if (schema.type === JsonSchemaTypeName.Number) {
    return 100
  } else if (schema.type === JsonSchemaTypeName.Boolean) {
    return 70
  } else if (schema.type === JsonSchemaTypeName.String) {
    return 160
  } else if (schema.$ref === SystemSchemaIds.File) {
    return 80
  }

  return 100
}
