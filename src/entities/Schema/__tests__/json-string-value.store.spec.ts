import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'

describe('JsonStringValueStore', () => {
  it('isValid', () => {
    const schema = new JsonStringStore()
    const store = new JsonStringValueStore(schema)

    expect(store.isValid).toEqual(true)

    schema.reference = 'User'
    expect(store.isValid).toEqual(false)

    store.value = 'user-1'
    expect(store.isValid).toEqual(true)
  })
})
