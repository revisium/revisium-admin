import { NumberNodeStore } from 'src/features/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'

describe('NumberNodeStore', () => {
  it('id', () => {
    const store = new NumberNodeStore()

    store.setId('id')
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('')

    store.submitChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
  })

  it('parent', () => {
    const parent = new ObjectNodeStore()
    const store = new NumberNodeStore()

    store.setParent(parent)
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(null)

    store.submitChanges()
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(parent)
  })

  it('connectedToParent', () => {
    const parent = new ObjectNodeStore()
    const store = new NumberNodeStore()

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

  it('isDirtyItself', () => {
    const store = new NumberNodeStore()

    expect(store.isDirtyItself).toBe(false)

    store.setId('id')
    expect(store.isDirtyItself).toBe(true)
    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
  })

  it('resetChanges', () => {
    const store = new NumberNodeStore()

    store.setId('id')
    store.submitChanges()

    store.setId('id2')
    expect(store.draftId).toEqual('id2')
    expect(store.id).toEqual('id')

    store.resetChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
  })
})
