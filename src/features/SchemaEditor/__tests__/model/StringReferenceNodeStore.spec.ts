import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/features/SchemaEditor/model/StringForeignKeyNodeStore.ts'

describe('StringForeignKeyNodeStore', () => {
  it('isDirtyItself', () => {
    const store = new StringForeignKeyNodeStore()

    expect(store.isDirtyItself).toBe(false)

    store.setForeignKey('User')
    expect(store.isDirtyItself).toBe(true)

    store.submitChanges()
    expect(store.isDirtyItself).toBe(false)
  })

  it('parent', () => {
    const parent = new StringNodeStore()
    const store = new StringForeignKeyNodeStore()
    store.setParent(parent)

    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(null)

    store.submitChanges()
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(parent)
  })

  it('connectedToParent', () => {
    const parent = new StringNodeStore()
    const store = new StringForeignKeyNodeStore()

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

  it('foreignKey', () => {
    const store = new StringForeignKeyNodeStore()

    expect(store.foreignKey).toBeNull()
    expect(store.draftForeignKey).toBeNull()

    store.setForeignKey('User')
    expect(store.foreignKey).toBeNull()
    expect(store.draftForeignKey).toBe('User')

    store.submitChanges()
    expect(store.foreignKey).toBe('User')
    expect(store.draftForeignKey).toBe('User')
  })

  it('resetChanges', () => {
    const store = new StringForeignKeyNodeStore()

    store.setForeignKey('id')
    store.submitChanges()

    store.setForeignKey('id2')
    expect(store.draftForeignKey).toEqual('id2')
    expect(store.foreignKey).toEqual('id')

    store.resetChanges()
    expect(store.draftForeignKey).toEqual('id')
    expect(store.foreignKey).toEqual('id')
  })
})
