import { JsonSchema } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import {
  rowCreatedAtSchema,
  rowCreatedIdSchema,
  rowHashSchema,
  rowIdSchema,
  rowPublishedAtSchema,
  rowSchemaHashSchema,
  rowUpdatedAtSchema,
  rowVersionIdSchema,
} from 'src/shared/schema/plugins'
import { fileSchema } from 'src/shared/schema/plugins/file-schema.ts'

export const schemaRefsMapper: Record<string, JsonSchema> = {
  [SystemSchemaIds.RowId]: rowIdSchema,
  [SystemSchemaIds.RowVersionId]: rowVersionIdSchema,
  [SystemSchemaIds.RowCreatedId]: rowCreatedIdSchema,
  [SystemSchemaIds.RowCreatedAt]: rowCreatedAtSchema,
  [SystemSchemaIds.RowPublishedAt]: rowPublishedAtSchema,
  [SystemSchemaIds.RowUpdatedAt]: rowUpdatedAtSchema,
  [SystemSchemaIds.RowHash]: rowHashSchema,
  [SystemSchemaIds.RowSchemaHash]: rowSchemaHashSchema,
  [SystemSchemaIds.File]: fileSchema,
}
