import { getArraySchema, getNumberSchema, getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { NumberNodeStore } from 'src/features/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/features/SchemaEditor/model/StringForeignKeyNodeStore.ts'

describe('ArrayNodeStore', () => {
  it('id', () => {
    const store = new ArrayNodeStore(new StringNodeStore())

    store.setId('id')
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('')

    store.submitChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
  })

  it('parent', () => {
    const parent = new ObjectNodeStore()
    const store = new ArrayNodeStore(new StringNodeStore())

    store.setParent(parent)
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(null)

    store.submitChanges()
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(parent)
  })

  it('connectedToParent', () => {
    const parent = new ObjectNodeStore()
    const store = new ArrayNodeStore(new StringNodeStore())

    store.setParent(parent)
    expect(store.draftConnectedToParent).toEqual(true)
    expect(store.connectedToParent).toEqual(false)

    store.submitChanges()
    expect(store.draftConnectedToParent).toEqual(true)
    expect(store.connectedToParent).toEqual(true)

    store.onRemoveFromParent()
    expect(store.draftConnectedToParent).toEqual(false)
    expect(store.connectedToParent).toEqual(true)

    store.submitChanges()
    expect(store.draftConnectedToParent).toEqual(false)
    expect(store.connectedToParent).toEqual(false)
  })

  it('items', () => {
    const items = new ObjectNodeStore()
    const store = new ArrayNodeStore(items)

    expect(store.draftItems).toEqual(items)
    expect(store.items).toEqual(items)

    const nextItems = new ObjectNodeStore()
    store.replaceItems(nextItems)
    expect(store.draftItems).toEqual(nextItems)
    expect(store.items).toEqual(items)

    store.submitChanges()
    expect(store.draftItems).toEqual(nextItems)
    expect(store.items).toEqual(nextItems)
  })

  it('schema', () => {
    const store = new ArrayNodeStore(new StringNodeStore())

    expect(store.getSchema().getPlainSchema()).toEqual(getArraySchema(getStringSchema()))

    store.replaceItems(new NumberNodeStore())
    expect(store.getSchema().getPlainSchema()).toEqual(getArraySchema(getNumberSchema()))
  })

  it('items parent', () => {
    const items = new StringNodeStore()
    const store = new ArrayNodeStore(items)

    expect(items.draftParent).toEqual(store)
    expect(items.parent).toEqual(store)
  })

  it('isValid', () => {
    const items = new StringNodeStore()
    const store = new ArrayNodeStore(items)

    expect(store.isValid).toEqual(true)

    items.setForeignKey(new StringForeignKeyNodeStore())
    expect(store.isValid).toEqual(false)

    items.draftForeignKey?.setForeignKey('User')
    expect(store.isValid).toEqual(true)
  })

  it('replaceItems', () => {
    const items = new StringNodeStore()
    const nextItems = new NumberNodeStore()
    const store = new ArrayNodeStore(items)

    store.replaceItems(nextItems)

    expect(items.draftParent).toBe(store)
    expect(nextItems.draftParent).toBe(store)
    expect(nextItems.nodeId).toBe(items.nodeId)
  })

  it('replaceItems and previous parent as object', () => {
    const root = new ObjectNodeStore()
    const items = new StringNodeStore()
    const array = new ArrayNodeStore(items)
    array.setId('array')
    root.addProperty(array)
    const nextItems = new NumberNodeStore()
    nextItems.setId('nextItems')
    root.addProperty(nextItems)

    expect(root.hasProperty(nextItems)).toBe(true)
    array.replaceItems(nextItems)

    expect(nextItems.draftParent).toBe(array)
    expect(root.hasProperty(nextItems)).toBe(false)
  })

  it('isDirtyItself', () => {
    const store = new ArrayNodeStore(new StringNodeStore())

    expect(store.isDirtyItself).toBe(false)

    store.setId('id')
    expect(store.isDirtyItself).toBe(true)
    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)

    store.replaceItems(new NumberNodeStore())
    expect(store.isDirtyItself).toBe(true)
    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
  })

  it('isDirty', () => {
    const store = new ArrayNodeStore(new StringNodeStore())

    store.setId('id')
    expect(store.isDirty).toBe(true)
    store.submitChanges()
    expect(store.isDirty).toBe(false)

    const field = new StringNodeStore()
    store.replaceItems(field)
    expect(store.isDirty).toBe(true)
    store.submitChanges()
    expect(store.isDirty).toBe(false)

    field.setForeignKey(new StringForeignKeyNodeStore())
    expect(store.isDirty).toBe(true)
    store.submitChanges()
    expect(store.isDirty).toBe(false)
  })

  it('resetChanges', () => {
    const items = new ObjectNodeStore()
    const field = new StringNodeStore()
    field.setId('field')
    items.addProperty(field)
    const store = new ArrayNodeStore(items)
    store.setId('id')
    store.submitChanges()

    store.setId('id2')
    field.setId('field2')
    expect(store.draftId).toBe('id2')
    expect(store.id).toBe('id')
    expect(field.draftId).toBe('field2')
    expect(field.id).toBe('field')

    store.resetChanges()
    expect(store.draftId).toBe('id')
    expect(store.id).toBe('id')
    expect(field.draftId).toBe('field')
    expect(field.id).toBe('field')
  })
})
