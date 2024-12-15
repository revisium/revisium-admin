import { getObjectSchema, getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { getJsonPathByNode } from 'src/features/SchemaEditor/lib/getJsonPathByNode.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'

describe('getJsonPathByNode', () => {
  it('no parent', () => {
    const object = new ObjectNodeStore()
    object.setId('object')
    expect(getJsonPathByNode(object, { preferDraftParent: false, preferDraftId: false })).toBe('')

    const array = new ArrayNodeStore(new StringNodeStore())
    array.setId('array')
    expect(getJsonPathByNode(array, { preferDraftParent: false, preferDraftId: false })).toBe('')
  })

  it('object parent', () => {
    const object = new ObjectNodeStore()
    object.setId('object')

    const string = new StringNodeStore()
    string.setId('field')
    object.addProperty(string)

    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe('/properties/field')
    string.submitChanges()
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe('/properties/field')

    string.setId('field2')
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe('/properties/field')

    string.submitChanges()
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe('/properties/field2')
  })

  it('array parent', () => {
    const string = new StringNodeStore()
    string.setId('field')

    const object = new ArrayNodeStore(string)
    object.setId('array')

    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe('/items')
    string.submitChanges()
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe('/items')
  })

  it('complex parent', () => {
    const rootObject = new ObjectNodeStore()
    const root = new ArrayNodeStore(rootObject)

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

    expect(getJsonPathByNode(rootObject, { preferDraftParent: false, preferDraftId: false })).toBe('/items')
    expect(getJsonPathByNode(arrayField, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array',
    )
    expect(getJsonPathByNode(rootForSub, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items',
    )
    expect(getJsonPathByNode(sub, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub',
    )
    expect(getJsonPathByNode(sub2, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2',
    )
    expect(getJsonPathByNode(arrayInSub2, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr',
    )
    expect(getJsonPathByNode(arrayInSub2.draftItems, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr/items',
    )
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr/items/items',
    )

    root.submitChanges()

    arrayField.setId('array2')
    sub.setId('sub_2')
    sub2.setId('sub2_2')
    arrayInSub2.setId('arr2')
    sub.addProperty(arrayInSub2)

    expect(getJsonPathByNode(rootObject, { preferDraftParent: false, preferDraftId: false })).toBe('/items')
    expect(getJsonPathByNode(arrayField, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array',
    )
    expect(getJsonPathByNode(arrayField, { preferDraftParent: false, preferDraftId: true })).toBe(
      '/items/properties/array2',
    )
    expect(getJsonPathByNode(rootForSub, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items',
    )
    expect(getJsonPathByNode(rootForSub, { preferDraftParent: false, preferDraftId: true })).toBe(
      '/items/properties/array2/items',
    )
    expect(getJsonPathByNode(sub, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub',
    )
    expect(getJsonPathByNode(sub, { preferDraftParent: false, preferDraftId: true })).toBe(
      '/items/properties/array2/items/properties/sub_2',
    )
    expect(getJsonPathByNode(sub2, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2',
    )
    expect(getJsonPathByNode(sub2, { preferDraftParent: false, preferDraftId: true })).toBe(
      '/items/properties/array2/items/properties/sub_2/properties/sub2_2',
    )
    expect(getJsonPathByNode(arrayInSub2, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr',
    )
    expect(getJsonPathByNode(arrayInSub2, { preferDraftParent: true, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/arr',
    )
    expect(getJsonPathByNode(arrayInSub2, { preferDraftParent: true, preferDraftId: true })).toBe(
      '/items/properties/array2/items/properties/sub_2/properties/arr2',
    )
    expect(getJsonPathByNode(arrayInSub2.draftItems, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr/items',
    )
    expect(getJsonPathByNode(arrayInSub2.draftItems, { preferDraftParent: false, preferDraftId: true })).toBe(
      '/items/properties/array2/items/properties/sub_2/properties/sub2_2/properties/arr2/items',
    )
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: false })).toBe(
      '/items/properties/array/items/properties/sub/properties/sub2/properties/arr/items/items',
    )
    expect(getJsonPathByNode(string, { preferDraftParent: false, preferDraftId: true })).toBe(
      '/items/properties/array2/items/properties/sub_2/properties/sub2_2/properties/arr2/items/items',
    )
  })

  it('complex parent', () => {
    const root = createSchemaNode(
      getObjectSchema({
        field: getStringSchema(),
      }),
    ) as ObjectNodeStore
    root.submitChanges()

    const field = root.getProperty('field')
    field.setId('field2')

    expect(getJsonPathByNode(field, { preferDraftParent: false, preferDraftId: true })).toBe('/properties/field2')

    expect(
      getJsonPathByNode(field, { preferDraftParent: false, preferDraftId: true, preferStartWithNotDraftId: true }),
    ).toBe('/properties/field')
  })
})

xdescribe('getSequenceByNode', () => {})

xdescribe('getJsonPathBySequence', () => {})
