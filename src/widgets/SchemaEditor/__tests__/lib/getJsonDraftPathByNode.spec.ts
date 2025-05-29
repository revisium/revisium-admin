import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { getJsonDraftPathByNode } from 'src/widgets/SchemaEditor/lib/getJsonDraftPathByNode.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'

describe('getJsonDraftPathByNode', () => {
  it('no parent', () => {
    const object = new ObjectNodeStore()
    object.setId('object')
    expect(getJsonDraftPathByNode(object)).toBe('')

    const array = new ArrayNodeStore(new StringNodeStore())
    array.setId('array')
    expect(getJsonDraftPathByNode(array)).toBe('')
  })

  it('object parent', () => {
    const object = new ObjectNodeStore()
    object.setId('object')

    const string = new StringNodeStore()
    string.setId('field')
    object.addProperty(string)

    expect(getJsonDraftPathByNode(string)).toBe('/properties/field')
  })

  it('useNotDraftIdFromTarget', () => {
    const root = new ObjectNodeStore()
    const object = new ObjectNodeStore()
    object.setId('root')
    root.addProperty(object)

    const string = new StringNodeStore()
    string.setId('field')
    object.addProperty(string)
    object.submitChanges()

    object.setId('root2')
    string.setId('field2')
    expect(getJsonDraftPathByNode(string)).toBe('/properties/root2/properties/field2')
    expect(getJsonDraftPathByNode(string, true)).toBe('/properties/root2/properties/field')
  })

  it('array parent', () => {
    const string = new StringNodeStore()
    string.setId('field')

    const object = new ArrayNodeStore(string)
    object.setId('array')

    expect(getJsonDraftPathByNode(string)).toBe('/items')
  })

  it('complex parent', () => {
    const rootObject = new ObjectNodeStore()
    new ArrayNodeStore(rootObject)

    const rootForSub = new ObjectNodeStore()
    const arrayField = new ArrayNodeStore(rootForSub)
    arrayField.setId('array')
    rootObject.addProperty(arrayField)

    const sub = new ObjectNodeStore()
    sub.setId('sub')
    rootForSub.addProperty(sub)

    const string = new StringNodeStore()
    string.setId('field')

    const sub2 = new ObjectNodeStore()
    sub2.setId('sub2')
    sub.addProperty(sub2)

    const arrayInSub2 = new ArrayNodeStore(new ArrayNodeStore(string))
    arrayInSub2.setId('arr')
    sub2.addProperty(arrayInSub2)

    expect(getJsonDraftPathByNode(rootObject)).toBe('/items')
    expect(getJsonDraftPathByNode(arrayField)).toBe('/items/properties/array')
    expect(getJsonDraftPathByNode(rootForSub)).toBe('/items/properties/array/items')
    expect(getJsonDraftPathByNode(sub)).toBe('/items/properties/array/items/properties/sub')
    expect(getJsonDraftPathByNode(sub2)).toBe('/items/properties/array/items/properties/sub/properties/sub2')
    expect(getJsonDraftPathByNode(arrayInSub2)).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr',
    )
    expect(getJsonDraftPathByNode(arrayInSub2.draftItems)).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr/items',
    )
    expect(getJsonDraftPathByNode(string)).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr/items/items',
    )
  })
})
