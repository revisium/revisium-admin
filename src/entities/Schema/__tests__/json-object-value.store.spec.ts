import { getObjectSchema, getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'

describe('JsonObjectValueStore', () => {
  it('isValid', () => {
    const schema = createJsonSchemaStore(
      getObjectSchema({
        userId: getStringSchema({ foreignKey: 'User' }),
        postId: getStringSchema({ foreignKey: 'Post' }),
      }),
    ) as JsonObjectStore

    const store = new JsonObjectValueStore(schema)

    expect(store.isValid).toEqual(false)

    store.updateBaseValue({ userId: 'user-1', postId: '' })
    expect(store.isValid).toEqual(false)

    store.updateBaseValue({ userId: 'user-1', postId: 'post-1' })
    expect(store.isValid).toEqual(true)
  })
})
