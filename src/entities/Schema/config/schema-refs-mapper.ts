import { JsonSchema } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { fileSchema } from 'src/shared/schema/plugins/file-schema.ts'
import { rowIdSchema } from 'src/shared/schema/plugins/row-id.schema.ts'

export const schemaRefsMapper: Record<string, JsonSchema> = {
  [SystemSchemaIds.RowId]: rowIdSchema,
  [SystemSchemaIds.File]: fileSchema,
}
