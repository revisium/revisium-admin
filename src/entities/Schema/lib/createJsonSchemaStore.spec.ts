import {
  getBooleanSchema,
  getNumberSchema,
  getObjectSchema,
  getStringSchema,
} from 'src/__tests__/utils/schema/schema.mocks.ts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { JsonBooleanStore } from 'src/entities/Schema/model/json-boolean.store.ts'
import { JsonNumberStore } from 'src/entities/Schema/model/json-number.store.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'

describe('createJsonSchemaStore', () => {
  it('readOnly', () => {
    const store: JsonObjectStore = createJsonSchemaStore(
      getObjectSchema({
        string: getStringSchema({
          readOnly: true,
        }),
        number: getNumberSchema(0, true),
        boolean: getBooleanSchema(true, true),
      }),
    ) as JsonObjectStore

    expect((store.properties['string'] as JsonStringStore).readOnly).toEqual(true)
    expect((store.properties['number'] as JsonNumberStore).readOnly).toEqual(true)
    expect((store.properties['boolean'] as JsonBooleanStore).readOnly).toEqual(true)
  })

  it('should copy default values from schema', () => {
    const store: JsonObjectStore = createJsonSchemaStore(
      getObjectSchema({
        string: getStringSchema({ defaultValue: 'hello' }),
        number: getNumberSchema(42),
        boolean: getBooleanSchema(true),
      }),
    ) as JsonObjectStore

    expect((store.properties['string'] as JsonStringStore).default).toEqual('hello')
    expect((store.properties['number'] as JsonNumberStore).default).toEqual(42)
    expect((store.properties['boolean'] as JsonBooleanStore).default).toEqual(true)
  })
})
