import {
  type JsonSchema,
  SystemSchemaIds,
  fileSchema,
  rowCreatedAtSchema,
  rowCreatedIdSchema,
  rowHashSchema,
  rowIdSchema,
  rowPublishedAtSchema,
  rowSchemaHashSchema,
  rowUpdatedAtSchema,
  rowVersionIdSchema,
} from '@revisium/schema-toolkit-ui'

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
