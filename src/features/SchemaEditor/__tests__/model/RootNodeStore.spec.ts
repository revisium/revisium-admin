import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { RootNodeStore } from 'src/features/SchemaEditor/model/RootNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'

describe('RootNodeStore', () => {
  it('tableId', () => {
    const object = new ObjectNodeStore()
    const store = new RootNodeStore(object, 'id1')

    object.setId('id1')
    expect(store.draftTableId).toEqual('id1')
    expect(store.tableId).toEqual('id1')

    object.submitChanges()
    expect(store.draftTableId).toEqual('id1')
    object.setId('id2')
    expect(store.tableId).toEqual('id1')
    expect(store.draftTableId).toEqual('id2')
  })

  it('isApproveDisabled', () => {
    const object = new ObjectNodeStore()
    const store = new RootNodeStore(object)
    expect(store.isApproveDisabled).toBe(true)

    object.setId('id')
    expect(store.isApproveDisabled).toBe(false)

    store.submitChanges()
    expect(store.isApproveDisabled).toBe(true)
  })

  it('getPatches and replaceNode', () => {
    const object = new ObjectNodeStore()
    const store = new RootNodeStore(object)
    const field = new StringNodeStore()
    field.setId('field')
    store.addProperty(object, field)

    expect(store.getPatches()).toStrictEqual<JsonPatch[]>([
      { op: 'add', path: '/properties/field', value: field.getSchema() },
    ])

    store.submitChanges()
    const nextNode = new StringNodeStore()
    store.replaceNode(nextNode)
    expect(store.getPatches()).toStrictEqual<JsonPatch[]>([
      { op: 'replace', path: '', value: nextNode.getSchema() },
    ])
  })

  it('getPlainSchema', () => {
    const object = new ObjectNodeStore()
    const field = new StringNodeStore()
    field.setId('field')
    object.addProperty(field)

    const store = new RootNodeStore(object)

    expect(store.getPlainSchema()).toEqual(object.getSchema())
  })

  xit('areThereDropTargets', () => {})

  xit('history tests', () => {})
})
