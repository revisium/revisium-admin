import { JsonSchema } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { fileSchema } from 'src/shared/schema/file-schema.ts'

export const schemaRefsMapper: Record<string, JsonSchema> = { [SystemSchemaIds.File]: fileSchema }
