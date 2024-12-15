import { getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'

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

    const reference = new StringReferenceNodeStore()
    reference.setReference('User')
    store.setReference(reference)

    expect(store.getSchema().getPlainSchema()).toEqual(getStringSchema({ reference: 'User' }))
  })

  it('isValid', () => {
    const store = new StringNodeStore()

    expect(store.isValid).toEqual(true)

    store.setReference(new StringReferenceNodeStore())
    expect(store.isValid).toEqual(false)

    store.draftReference?.setReference('User')
    expect(store.isValid).toEqual(true)
  })

  it('isDirtyItself', () => {
    const store = new StringNodeStore()

    expect(store.isDirtyItself).toBe(false)
    store.setId('id')
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)

    store.setReference(new StringReferenceNodeStore())
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)

    store.setReference(null)
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
  })

  it('isDirty', () => {
    const store = new StringNodeStore()

    store.setReference(new StringReferenceNodeStore())
    expect(store.isDirtyItself).toBe(true)
    expect(store.isDirty).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
    expect(store.isDirty).toBe(false)

    store.draftReference?.setReference('User')
    expect(store.isDirtyItself).toBe(true)
    expect(store.isDirty).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
    expect(store.isDirty).toBe(false)
  })

  it('reference', () => {
    const store = new StringNodeStore()

    expect(store.reference).toBeNull()
    expect(store.draftReference).toBeNull()

    const ref = new StringReferenceNodeStore()
    store.setReference(ref)
    expect(store.reference).toBeNull()
    expect(store.draftReference).toBe(ref)
    expect(ref.parent).toBeNull()
    expect(ref.draftParent).toBe(store)

    store.submitChanges()
    expect(store.reference).toBe(ref)
    expect(store.draftReference).toBe(ref)
    expect(ref.parent).toBe(store)
    expect(ref.draftParent).toBe(store)
  })

  it('resetChanges', () => {
    const store = new StringNodeStore()
    store.setReference(new StringReferenceNodeStore())

    store.setId('id')
    store.draftReference?.setReference('ref')
    store.submitChanges()

    store.setId('id2')
    store.draftReference?.setReference('ref2')
    expect(store.draftId).toEqual('id2')
    expect(store.id).toEqual('id')
    expect(store.draftReference?.draftReference).toEqual('ref2')
    expect(store.draftReference?.reference).toEqual('ref')

    store.resetChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
    expect(store.draftReference?.draftReference).toEqual('ref')
    expect(store.draftReference?.reference).toEqual('ref')
  })
})
