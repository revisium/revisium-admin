import { getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/features/SchemaEditor/model/StringForeignKeyNodeStore.ts'

describe('StringNodeStore', () => {
  it('id', () => {
    const store = new StringNodeStore()

    store.setId('id')
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('')

    store.submitChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
  })

  it('parent', () => {
    const parent = new ObjectNodeStore()
    const store = new StringNodeStore()
    parent.addProperty(store)

    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(null)

    store.submitChanges()
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(parent)
  })

  it('connectedToParent', () => {
    const parent = new ObjectNodeStore()
    const store = new StringNodeStore()

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

  it('schema', () => {
    const store = new StringNodeStore()

    expect(store.getSchema().getPlainSchema()).toEqual(getStringSchema())

    const foreignKey = new StringForeignKeyNodeStore()
    foreignKey.setForeignKey('User')
    store.setForeignKey(foreignKey)

    expect(store.getSchema().getPlainSchema()).toEqual(getStringSchema({ foreignKey: 'User' }))
  })

  it('isValid', () => {
    const store = new StringNodeStore()

    expect(store.isValid).toEqual(true)

    store.setForeignKey(new StringForeignKeyNodeStore())
    expect(store.isValid).toEqual(false)

    store.draftForeignKey?.setForeignKey('User')
    expect(store.isValid).toEqual(true)
  })

  it('isDirtyItself', () => {
    const store = new StringNodeStore()

    expect(store.isDirtyItself).toBe(false)
    store.setId('id')
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)

    store.setForeignKey(new StringForeignKeyNodeStore())
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)

    store.setForeignKey(null)
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
  })

  it('isDirty', () => {
    const store = new StringNodeStore()

    store.setForeignKey(new StringForeignKeyNodeStore())
    expect(store.isDirtyItself).toBe(true)
    expect(store.isDirty).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
    expect(store.isDirty).toBe(false)

    store.draftForeignKey?.setForeignKey('User')
    expect(store.isDirtyItself).toBe(true)
    expect(store.isDirty).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
    expect(store.isDirty).toBe(false)
  })

  it('foreignKey', () => {
    const store = new StringNodeStore()

    expect(store.foreignKey).toBeNull()
    expect(store.draftForeignKey).toBeNull()

    const ref = new StringForeignKeyNodeStore()
    store.setForeignKey(ref)
    expect(store.foreignKey).toBeNull()
    expect(store.draftForeignKey).toBe(ref)
    expect(ref.parent).toBeNull()
    expect(ref.draftParent).toBe(store)

    store.submitChanges()
    expect(store.foreignKey).toBe(ref)
    expect(store.draftForeignKey).toBe(ref)
    expect(ref.parent).toBe(store)
    expect(ref.draftParent).toBe(store)
  })

  it('resetChanges', () => {
    const store = new StringNodeStore()
    store.setForeignKey(new StringForeignKeyNodeStore())

    store.setId('id')
    store.draftForeignKey?.setForeignKey('ref')
    store.submitChanges()

    store.setId('id2')
    store.draftForeignKey?.setForeignKey('ref2')
    expect(store.draftId).toEqual('id2')
    expect(store.id).toEqual('id')
    expect(store.draftForeignKey?.draftForeignKey).toEqual('ref2')
    expect(store.draftForeignKey?.foreignKey).toEqual('ref')

    store.resetChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
    expect(store.draftForeignKey?.draftForeignKey).toEqual('ref')
    expect(store.draftForeignKey?.foreignKey).toEqual('ref')
  })
})
