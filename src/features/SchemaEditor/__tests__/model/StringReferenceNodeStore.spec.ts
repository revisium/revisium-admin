import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'

describe('StringReferenceNodeStore', () => {
  it('isDirtyItself', () => {
    const store = new StringReferenceNodeStore()

    expect(store.isDirtyItself).toBe(false)

    store.setReference('User')
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
  })

  it('parent', () => {
    const parent = new StringNodeStore()
    const store = new StringReferenceNodeStore()
    store.setParent(parent)

    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(null)

    store.submitChanges()
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(parent)
  })

  it('connectedToParent', () => {
    const parent = new StringNodeStore()
    const store = new StringReferenceNodeStore()

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

  it('reference', () => {
    const store = new StringReferenceNodeStore()

    expect(store.reference).toBeNull()
    expect(store.draftReference).toBeNull()

    store.setReference('User')
    expect(store.reference).toBeNull()
    expect(store.draftReference).toBe('User')

    store.submitChanges()
    expect(store.reference).toBe('User')
    expect(store.draftReference).toBe('User')
  })

  it('resetChanges', () => {
    const store = new StringReferenceNodeStore()

    store.setReference('id')
    store.submitChanges()

    store.setReference('id2')
    expect(store.draftReference).toEqual('id2')
    expect(store.reference).toEqual('id')

    store.resetChanges()
    expect(store.draftReference).toEqual('id')
    expect(store.reference).toEqual('id')
  })
})
