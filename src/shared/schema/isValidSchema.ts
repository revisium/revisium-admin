import Ajv, { AnySchema } from 'ajv/dist/2020'
import { metaSchema } from 'src/shared/schema/meta-schema.ts'

export const isValidSchema = (schema: object): boolean => {
  const ajv = new Ajv()
  return ajv.validate(metaSchema, schema as AnySchema)
}
