import Ajv, { AnySchema } from 'ajv/dist/2020'
import { metaSchema } from 'src/shared/schema/meta-schema.ts'

export const isValidSchema = (schema: object): boolean => {
  const ajv = new Ajv()
  ajv.addKeyword({
    keyword: 'foreignKey',
    type: 'string',
  })
  ajv.addFormat('regex', {
    type: 'string',
    validate: (str: string) => {
      try {
        new RegExp(str)
        return true
      } catch {
        return false
      }
    },
  })

  return ajv.validate(metaSchema, schema as AnySchema)
}
