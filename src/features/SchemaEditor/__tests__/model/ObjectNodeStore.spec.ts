import { getNumberSchema, getObjectSchema, getStringSchema } from 'src/__tests__/utils/schema/schema.mocks.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { BooleanNodeStore } from 'src/features/SchemaEditor/model/BooleanNodeStore.ts'
import { NumberNodeStore } from 'src/features/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/features/SchemaEditor/model/StringForeignKeyNodeStore.ts'

describe('ObjectNodeStore', () => {
  it('id', () => {
    const store = new ObjectNodeStore()

    store.setId('id')
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('')

    store.submitChanges()
    expect(store.draftId).toEqual('id')
    expect(store.id).toEqual('id')
  })

  it('parent', () => {
    const parent = new ObjectNodeStore()
    const store = new ObjectNodeStore()

    store.setParent(parent)
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(null)

    store.submitChanges()
    expect(store.draftParent).toEqual(parent)
    expect(store.parent).toEqual(parent)
  })

  it('connectedToParent', () => {
    const parent = new ObjectNodeStore()
    const store = new ObjectNodeStore()

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

  it('properties', () => {
    const parent = new ObjectNodeStore()
    const store = new ObjectNodeStore()

    expect(parent.draftProperties).toEqual(parent.properties)

    parent.addProperty(store)
    expect(parent.draftProperties).not.toEqual(parent.properties)

    parent.submitChanges()
    expect(parent.draftProperties).toEqual(parent.properties)
  })

  it('schema', () => {
    const store = new ObjectNodeStore()

    expect(store.getSchema()).toEqual(getObjectSchema({}))

    const str = new StringNodeStore()
    str.setId('str')
    const num = new NumberNodeStore()
    num.setId('num')

    store.addProperty(str)
    store.addProperty(num)

    expect(store.getSchema()).toEqual(
      getObjectSchema({ [str.draftId]: getStringSchema(), [num.draftId]: getNumberSchema() }),
    )

    expect(store.getSchema({ skipObjectProperties: true })).toEqual(getObjectSchema({}))
  })

  it('isValid', () => {
    const store = new ObjectNodeStore()

    expect(store.isValid).toEqual(true)

    const num = new NumberNodeStore()
    num.setId('num')
    store.addProperty(num)
    expect(store.isValid).toEqual(true)

    const str = new StringNodeStore()
    str.setId('field')
    store.addProperty(str)
    expect(store.isValid).toEqual(true)

    str.setForeignKey(new StringForeignKeyNodeStore())
    expect(store.isValid).toEqual(false)

    str.draftForeignKey?.setForeignKey('User')
    expect(store.isValid).toEqual(true)
  })

  it('unique ids', () => {
    const store = new ObjectNodeStore()

    expect(store.isValid).toEqual(true)

    const field1 = new StringNodeStore()
    field1.setId('field')
    const field2 = new StringNodeStore()
    field2.setId('field')

    store.addProperty(field1)
    expect(store.isValid).toEqual(true)
    store.addProperty(field2)
    expect(store.isValid).toEqual(false)
    field2.setId('field2')
    expect(store.isValid).toEqual(true)
  })

  it('changedIdProperties', () => {
    const object = new ObjectNodeStore()
    const field1 = new StringNodeStore()
    field1.setId('field1')
    object.addProperty(field1)
    const field2 = new ObjectNodeStore()
    field2.setId('field2')
    object.addProperty(field2)
    const fieldForReplace = new ObjectNodeStore()
    fieldForReplace.setId('fieldForReplace')
    object.addProperty(fieldForReplace)
    object.submitChanges()

    field1.setId('field1_1')
    field2.setId('field2_1')

    const nextFieldForReplace = new StringNodeStore()
    object.replaceProperty(fieldForReplace, nextFieldForReplace)
    nextFieldForReplace.setId('nextFieldForReplace')

    expect(object.changedIdProperties).toStrictEqual([
      { previousProperty: field1, currentProperty: field1 },
      { previousProperty: field2, currentProperty: field2 },
      { previousProperty: fieldForReplace, currentProperty: nextFieldForReplace },
    ])
  })

  it('hasProperty', () => {
    const object = new ObjectNodeStore()
    const field = new ObjectNodeStore()

    object.addProperty(field)
    expect(object.hasProperty(field)).toBe(true)

    object.removeProperty(field.nodeId)
    expect(object.hasProperty(field)).toBe(false)
  })

  it('addProperty', () => {
    const store = new ObjectNodeStore()

    const field1 = new ObjectNodeStore()
    store.addProperty(field1)
    expect(store.draftProperties).toEqual([field1])
    expect(field1.draftParent).toBe(store)
    expect(field1.draftConnectedToParent).toBe(true)

    const field2 = new NumberNodeStore()
    store.addProperty(field2)
    expect(store.draftProperties).toEqual([field1, field2])
    expect(field2.draftParent).toBe(store)
    expect(field2.draftConnectedToParent).toBe(true)
  })

  it('afterChild', () => {
    const store = new ObjectNodeStore()

    const field1 = new ObjectNodeStore()
    const field2 = new StringNodeStore()
    store.addProperty(field1)
    store.addProperty(field2)
    expect(store.draftProperties).toEqual([field1, field2])

    const field3 = new NumberNodeStore()
    field3.setId('num')

    store.addProperty(field3, { afterNode: field1 })
    expect(store.draftProperties).toEqual([field1, field3, field2])
    expect(field3.draftParent).toBe(store)
    expect(field3.draftConnectedToParent).toBe(true)
  })

  it('beforeChild', () => {
    const store = new ObjectNodeStore()
    const field1 = new ObjectNodeStore()
    const field2 = new StringNodeStore()
    store.addProperty(field1)
    store.addProperty(field2)

    expect(store.draftProperties).toEqual([field1, field2])

    const field3 = new NumberNodeStore()

    store.addProperty(field3, { beforeNode: field1 })
    expect(store.draftProperties).toEqual([field3, field1, field2])
    expect(field3.draftParent).toBe(store)
    expect(field3.draftConnectedToParent).toBe(true)
  })

  it('addProperty and previous parent as object', () => {
    const root = new ObjectNodeStore()
    const object = new ObjectNodeStore()
    object.setId('object')
    root.addProperty(object)

    const field = new ObjectNodeStore()
    field.setId('field')
    object.addProperty(field)
    expect(field.draftParent).toBe(object)
    expect(object.hasProperty(field)).toBe(true)

    root.addProperty(field)
    expect(field.draftParent).toBe(root)
    expect(root.hasProperty(field)).toBe(true)
    expect(object.hasProperty(field)).toBe(false)
    expect(field.draftConnectedToParent).toBe(true)
  })

  it('addProperty and previous parent as array', () => {
    const root = new ObjectNodeStore()
    const field = new ObjectNodeStore()
    const array = new ArrayNodeStore(field)
    array.setId('array')
    root.addProperty(array)

    expect(field.draftParent).toBe(array)

    expect(() => root.addProperty(field)).toThrowError('Invalid parent')
  })

  it('addedProperties', () => {
    const object = new ObjectNodeStore()
    const fieldForReplace = new StringNodeStore()
    fieldForReplace.setId('fieldForReplace')
    const field = new ObjectNodeStore()
    field.setId('field')
    object.addProperty(field)
    object.addProperty(fieldForReplace)
    object.submitChanges()

    const field2 = new StringNodeStore()
    field2.setId('field2')
    object.addProperty(field2)

    const field3 = new StringNodeStore()
    field2.setId('field3')
    object.addProperty(field3)
    object.removeProperty(field3.nodeId)

    object.replaceProperty(fieldForReplace, new NumberNodeStore())

    const newAddedFieldForReplace = new StringNodeStore()
    newAddedFieldForReplace.setId('newFieldForReplace')
    object.addProperty(newAddedFieldForReplace)
    const boolean = new BooleanNodeStore()
    object.replaceProperty(newAddedFieldForReplace, boolean)

    expect(object.addedProperties).toStrictEqual([field2, boolean])
  })

  it('removeProperty', () => {
    const store = new ObjectNodeStore()

    const field = new ObjectNodeStore()
    store.addProperty(field)
    expect(field.draftConnectedToParent).toBe(true)
    expect(store.draftProperties).toEqual([field])

    store.removeProperty(field.nodeId)
    expect(store.draftProperties).toEqual([])
    expect(field.draftConnectedToParent).toBe(false)
  })

  it('removedProperties', () => {
    const root = new ObjectNodeStore()
    const forRemove = new ObjectNodeStore()
    forRemove.setId('forRemove')
    root.addProperty(forRemove)
    const object = new ObjectNodeStore()
    object.setId('root')
    root.addProperty(object)
    const field = new ObjectNodeStore()
    field.setId('field')
    object.addProperty(field)
    const field2 = new StringNodeStore()
    field2.setId('field2')
    object.addProperty(field2)
    const fieldForMove = new StringNodeStore()
    fieldForMove.setId('fieldForMove')
    object.addProperty(fieldForMove)
    const fieldForMoveAndRemove = new StringNodeStore()
    fieldForMove.setId('fieldForMoveAndRemove')
    object.addProperty(fieldForMoveAndRemove)
    const fieldForReplace = new StringNodeStore()
    fieldForReplace.setId('fieldForReplace')
    object.addProperty(fieldForReplace)
    root.submitChanges()

    const field3 = new StringNodeStore()
    field2.setId('field3')
    object.addProperty(field3)
    object.removeProperty(field3.nodeId)
    object.removeProperty(field2.nodeId)
    object.removeProperty(field.nodeId)
    object.replaceProperty(fieldForReplace, new StringNodeStore())

    root.addProperty(fieldForMove)

    expect(object.removedProperties).toStrictEqual([field, field2])
  })

  it('notChangedProperties', () => {
    const object = new ObjectNodeStore()
    const fieldForReplace = new StringNodeStore()
    fieldForReplace.setId('fieldForReplace')
    object.addProperty(fieldForReplace)
    const field = new ObjectNodeStore()
    field.setId('field')
    object.addProperty(field)
    const field2 = new StringNodeStore()
    field2.setId('field2')
    object.addProperty(field2)
    const field3 = new StringNodeStore()
    field2.setId('field3')
    object.addProperty(field3)
    object.submitChanges()

    object.removeProperty(field2.nodeId)
    object.replaceProperty(fieldForReplace, new StringNodeStore())

    expect(object.notChangedProperties).toStrictEqual([field, field3])
  })

  it('replaceProperty', () => {
    const store = new ObjectNodeStore()

    const field1 = new StringNodeStore()
    store.addProperty(field1)
    const field2 = new ObjectNodeStore()
    field2.setId('field2')
    store.addProperty(field2)
    const field3 = new StringNodeStore()
    store.addProperty(field3)
    expect(store.draftProperties).toEqual([field1, field2, field3])
    expect(field2.draftConnectedToParent).toBe(true)

    const field4 = new NumberNodeStore()
    field4.setId('field4')
    store.replaceProperty(field2, field4)
    expect(field2.draftConnectedToParent).toBe(false)
    expect(field4.draftConnectedToParent).toBe(true)
    expect(store.draftProperties).toEqual([field1, field4, field3])
    expect(field2.draftParent).toBe(store)
    expect(field4.draftParent).toBe(store)
    expect(field4.nodeId).toBe(field2.nodeId)
    expect(field4.draftId).toBe(field2.draftId)
  })

  it('replaceProperty and previousParent', () => {
    const store = new ObjectNodeStore()

    const field1 = new StringNodeStore()
    field1.setId('field1')
    store.addProperty(field1)
    const nextField1 = new NumberNodeStore()
    store.replaceProperty(field1, nextField1)
    expect(nextField1.id).toBe('')
    expect(nextField1.parent).toBe(null)

    const field2 = new StringNodeStore()
    field2.setId('field2')
    store.addProperty(field2)
    store.submitChanges()
    const nextField2 = new NumberNodeStore()
    store.replaceProperty(field2, nextField2)
    expect(nextField2.id).toBe('field2')
    expect(nextField2.parent).toBe(store)
  })

  it('replacedProperties', () => {
    const object = new ObjectNodeStore()
    const fieldForReplace = new StringNodeStore()
    fieldForReplace.setId('fieldForReplace')
    const field = new ObjectNodeStore()
    field.setId('field')
    object.addProperty(field)
    object.addProperty(fieldForReplace)
    object.submitChanges()

    const field2 = new StringNodeStore()
    field2.setId('field2')
    object.addProperty(field2)

    const field3 = new StringNodeStore()
    field2.setId('field3')
    object.addProperty(field3)
    object.removeProperty(field3.nodeId)

    const number = new NumberNodeStore()
    object.replaceProperty(fieldForReplace, number)

    const newAddedFieldForReplace = new StringNodeStore()
    newAddedFieldForReplace.setId('newFieldForReplace')
    object.addProperty(newAddedFieldForReplace)
    const boolean = new BooleanNodeStore()
    object.replaceProperty(newAddedFieldForReplace, boolean)

    expect(object.replacedProperties).toStrictEqual([{ previousProperty: fieldForReplace, currentProperty: number }])
  })

  it('movedProperties', () => {
    const root = new ObjectNodeStore()
    const movedProperty = new ObjectNodeStore()
    movedProperty.setId('movedProperty')
    root.addProperty(movedProperty)
    const object = new ObjectNodeStore()
    object.setId('object')
    root.addProperty(object)
    const fieldForReplace = new StringNodeStore()
    fieldForReplace.setId('fieldForReplace')
    const field = new ObjectNodeStore()
    field.setId('field')
    object.addProperty(field)
    object.addProperty(fieldForReplace)
    root.submitChanges()

    const field2 = new StringNodeStore()
    field2.setId('field2')
    object.addProperty(field2)

    const number = new NumberNodeStore()
    object.replaceProperty(fieldForReplace, number)

    object.addProperty(movedProperty)

    expect(object.movedProperties).toStrictEqual([movedProperty])
  })

  it('showingCreateField', () => {
    const store = new ObjectNodeStore()

    expect(store.showingCreateField).toBe(false)
    store.setId('field')
    expect(store.showingCreateField).toBe(true)

    store.setId('')
    expect(store.showingCreateField).toBe(false)
    store.setParent(new ObjectNodeStore())
    expect(store.showingCreateField).toBe(true)
  })

  it('isDisabledCreateField', () => {
    const store = new ObjectNodeStore()

    expect(store.isDisabledCreateField).toBe(true)
    store.setId('id')
    expect(store.isDisabledCreateField).toBe(false)

    store.setId('')
    expect(store.isDisabledCreateField).toBe(true)
    store.setParent(new ArrayNodeStore(store))
    expect(store.isDisabledCreateField).toBe(false)

    store.setParent(null)
    store.setId('')
    expect(store.isDisabledCreateField).toBe(true)
    store.setParent(new ObjectNodeStore())
    expect(store.isDisabledCreateField).toBe(true)

    store.setParent(null)
    store.setId('id')
    expect(store.isDisabledCreateField).toBe(false)
    const field = new StringNodeStore()
    store.addProperty(field)
    expect(store.isDisabledCreateField).toBe(true)
    field.setId('field')
    expect(store.isDisabledCreateField).toBe(false)
  })

  describe('isDirtyItself', () => {
    it('isDirtyItself and id', () => {
      const store = new ObjectNodeStore()

      expect(store.isDirtyItself).toBe(false)

      store.setId('id')
      expect(store.isDirtyItself).toBe(true)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)
    })

    it('isDirtyItself and addProperty', () => {
      const store = new ObjectNodeStore()

      expect(store.isDirtyItself).toBe(false)

      store.addProperty(new StringNodeStore())
      expect(store.isDirtyItself).toBe(true)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)
    })

    it('isDirtyItself and removeProperty', () => {
      const store = new ObjectNodeStore()

      const field = new StringNodeStore()

      store.addProperty(field)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)

      store.removeProperty(field.nodeId)
      expect(store.isDirtyItself).toBe(true)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)
    })

    it('isDirtyItself and replaceProperty', () => {
      const store = new ObjectNodeStore()

      const field = new StringNodeStore()
      const nextField = new NumberNodeStore()

      store.addProperty(field)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)

      store.replaceProperty(field, nextField)
      expect(store.isDirtyItself).toBe(true)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)
    })

    it('isDirtyItself and removeProperty and resetting', () => {
      const store = new ObjectNodeStore()

      const field1 = new StringNodeStore()
      const field2 = new StringNodeStore()
      const field3 = new StringNodeStore()
      const field4 = new StringNodeStore()

      store.addProperty(field1)
      store.addProperty(field2)
      store.addProperty(field3)
      store.submitChanges()
      expect(store.isDirtyItself).toBe(false)

      store.addProperty(field4, { afterNode: field2 })
      expect(store.isDirtyItself).toBe(true)

      store.removeProperty(field4.nodeId)
      expect(store.isDirtyItself).toBe(false)
    })
  })

  it('isDirty', () => {
    const store = new ObjectNodeStore()

    store.setId('id')
    expect(store.isDirty).toBe(true)
    store.submitChanges()
    expect(store.isDirty).toBe(false)

    const nested = new ObjectNodeStore()
    store.addProperty(nested)
    expect(store.isDirty).toBe(true)
    store.submitChanges()
    expect(store.isDirty).toBe(false)

    nested.setId('nested')
    expect(store.isDirty).toBe(true)
    store.submitChanges()
    expect(store.isDirty).toBe(false)
  })

  it('resetChanges', () => {
    const store = new ObjectNodeStore()
    const nested = new ObjectNodeStore()
    store.addProperty(nested)
    nested.setId('nested')
    store.setId('id')

    store.submitChanges()
    nested.setId('nested2')
    store.setId('id2')

    expect(store.draftId).toBe('id2')
    expect(store.id).toBe('id')
    expect(nested.draftId).toBe('nested2')
    expect(nested.id).toBe('nested')

    store.resetChanges()
    expect(store.draftId).toBe('id')
    expect(store.id).toBe('id')
    expect(nested.draftId).toBe('nested')
    expect(nested.id).toBe('nested')
  })
})
