import { getArraySchema, getObjectSchema, getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'

describe('JsonArrayValueStore', () => {
  it('isValid', () => {
    const schema = createJsonSchemaStore(
      getArraySchema(
        getObjectSchema({
          userId: getStringSchema({ reference: 'User' }),
        }),
      ),
    ) as JsonArrayStore

    const store = new JsonArrayValueStore(schema)

    expect(store.isValid).toEqual(true)

    store.updateBaseValue([{ userId: '' }])
    expect(store.isValid).toEqual(false)

    store.updateBaseValue([{ userId: 'user-1' }])
    expect(store.isValid).toEqual(true)
  })
})
