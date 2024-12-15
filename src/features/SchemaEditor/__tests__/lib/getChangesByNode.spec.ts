import {
  getArraySchema,
  getNumberSchema,
  getObjectSchema,
  getStringSchema,
} from 'src/__tests__/utils/schema/schema.mocks.ts'
import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { BooleanNodeStore } from 'src/features/SchemaEditor/model/BooleanNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { NumberNodeStore } from 'src/features/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { RootNodeStore } from 'src/features/SchemaEditor/model/RootNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'

describe('getChangesByNode', () => {
  it.each([
    new StringNodeStore(),
    new NumberNodeStore(),
    new BooleanNodeStore(),
    new ObjectNodeStore(),
    new ArrayNodeStore(new StringNodeStore()),
  ])('changed id %#', (item) => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    root.setId(item, 'field')
    root.addProperty(object, item)
    root.submitChanges()

    root.setId(item, 'field2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'move', from: '/properties/field', path: '/properties/field2' },
    ])
  })

  it('added property', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.addProperty(object, string)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'add', path: '/properties/field', value: string.getSchema().getPlainSchema() },
    ])
  })

  it('added property + nested added property', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const objectField = new ObjectNodeStore()
    root.setId(objectField, 'object')
    root.addProperty(object, objectField)

    const nestedField = new StringNodeStore()
    root.setId(nestedField, 'nestedField')
    root.addProperty(objectField, nestedField)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      {
        op: 'add',
        path: '/properties/object',
        value: getObjectSchema({}),
      },
      {
        op: 'add',
        path: '/properties/object/properties/nestedField',
        value: getStringSchema(),
      },
    ])
  })

  describe('removing', () => {
    it('removed property', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getStringSchema(),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      root.removeProperty(object, object.getProperty('field'))

      expect(root.getPatches()).toEqual<JsonPatch[]>([{ op: 'remove', path: '/properties/field' }])
    })

    it('removed nested property + removed root', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getObjectSchema({
              nestedField: getStringSchema(),
            }),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const field = object.getProperty<ObjectNodeStore>('field')
      const nestedField = field.getProperty('nestedField')
      root.removeProperty(field, nestedField)
      root.removeProperty(object, field)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        { op: 'remove', path: '/properties/field/properties/nestedField' },
        { op: 'remove', path: '/properties/field' },
      ])
    })

    it('added and then removed property', () => {
      const root = new RootNodeStore(createSchemaNode(getObjectSchema({})))
      root.submitChanges()

      const object = getObject(root.node)
      const field = new StringNodeStore()
      root.addProperty(object, field)
      root.removeProperty(object, field)

      expect(root.getPatches()).toEqual<JsonPatch[]>([])
    })

    it('added, removed and replaced a complex structure and then removed root property for them', () => {
      const root = new RootNodeStore(createSchemaNode(getObjectSchema({})))
      root.submitChanges()

      const object = getObject(root.node)
      const target = createNode<ObjectNodeStore>(getObjectSchema({}), 'target')
      root.addProperty(object, target)

      const fieldForReplace = createNode<ObjectNodeStore>(getObjectSchema({}), 'fieldForReplace')
      root.addProperty(target, fieldForReplace)
      const str = createNode(getStringSchema(), 'str')
      root.addProperty(fieldForReplace, str)
      root.replaceProperty(fieldForReplace, str, new NumberNodeStore())

      const addedProperty = createNode(getStringSchema(), 'addedField')
      root.addProperty(target, addedProperty)
      root.removeProperty(target, addedProperty)

      const array = createNode<ArrayNodeStore>(getArraySchema(getStringSchema()), 'array')
      root.addProperty(target, array)
      const arrayObject = createNode<ObjectNodeStore>(getObjectSchema({}))
      root.replaceItems(array, arrayObject)
      root.addProperty(arrayObject, createNode(getStringSchema(), 'nestedField'))

      root.removeProperty(object, target)

      expect(root.getPatches()).toEqual<JsonPatch[]>([])
    })

    it('moved and removed a complex structure and then removed root property for them', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            move1: getObjectSchema({}),
            move2: getObjectSchema({}),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const move1 = object.getProperty<ObjectNodeStore>('move1')
      const move2 = object.getProperty<ObjectNodeStore>('move2')
      const target = createNode<ObjectNodeStore>(getObjectSchema({}), 'target')
      root.addProperty(object, target)

      const addedProperty = createNode<ObjectNodeStore>(getObjectSchema({}), 'addedField')
      root.addProperty(target, addedProperty)
      root.addProperty(target, move2)
      root.addProperty(addedProperty, move1)

      root.removeProperty(object, target)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        { op: 'remove', path: '/properties/move2' },
        { op: 'remove', path: '/properties/move1' },
      ])
    })

    it('moved and removed a complex structure (+nested changes in moved nodes) and then removed root property for them', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            move1: getObjectSchema({
              nested1: getStringSchema(),
            }),
            move2: getObjectSchema({
              nested2: getNumberSchema(),
            }),
            field: getObjectSchema({}),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const move1 = object.getProperty<ObjectNodeStore>('move1')
      const nested1 = move1.getProperty('nested1')
      const move2 = object.getProperty<ObjectNodeStore>('move2')
      const nested2 = move2.getProperty('nested2')
      const field = object.getProperty<ObjectNodeStore>('field')

      const target = createNode<ObjectNodeStore>(getObjectSchema({}), 'target')
      root.addProperty(object, target)
      root.removeProperty(move1, nested1)
      root.addProperty(move1, createNode(getStringSchema(), 'test'))
      root.replaceProperty(move2, nested2, new BooleanNodeStore())

      const addedProperty = createNode<ObjectNodeStore>(getObjectSchema({}), 'addedField')
      root.addProperty(target, addedProperty)
      root.addProperty(target, move2)
      root.addProperty(target, field)
      root.addProperty(addedProperty, move1)

      root.addProperty(field, createNode(getStringSchema(), 'test'))

      root.removeProperty(object, target)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        // TODO need to avoid '/properties/move1/properties/nested1' patch
        // NodeHistory:  this.deepRemovePatches(node) after pushing to stack
        {
          op: 'remove',
          path: '/properties/move1/properties/nested1',
        },
        {
          op: 'remove',
          path: '/properties/move2',
        },
        {
          op: 'remove',
          path: '/properties/field',
        },
        {
          op: 'remove',
          path: '/properties/move1',
        },
      ])
    })

    it('removed old property with changed children', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            target: getObjectSchema({
              fieldForReplace: getObjectSchema({}),
            }),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const target = object.getProperty<ObjectNodeStore>('target')

      const fieldForReplace = target.getProperty<ObjectNodeStore>('fieldForReplace')
      const str = createNode(getStringSchema(), 'str')
      root.addProperty(fieldForReplace, str)
      root.replaceProperty(fieldForReplace, str, new NumberNodeStore())
      root.replaceProperty(target, fieldForReplace, new BooleanNodeStore())

      const addedProperty = createNode(getStringSchema(), 'addedField')
      root.addProperty(target, addedProperty)
      root.removeProperty(target, addedProperty)

      const array = createNode<ArrayNodeStore>(getArraySchema(getStringSchema()), 'array')
      root.addProperty(target, array)
      const arrayObject = createNode<ObjectNodeStore>(getObjectSchema({}))
      root.replaceItems(array, arrayObject)
      root.addProperty(arrayObject, createNode(getStringSchema(), 'nestedField'))

      root.removeProperty(object, target)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/target',
        },
      ])
    })
  })

  it('changed property', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.addProperty(object, string)
    root.submitChanges()

    root.setId(string, 'field2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'move', from: '/properties/field', path: '/properties/field2' },
    ])
  })

  it('changed and removed property', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const field = new StringNodeStore()
    root.setId(field, 'field')
    root.addProperty(object, field)
    root.submitChanges()

    root.setId(field, 'field2')
    root.removeProperty(object, field)

    expect(root.getPatches()).toEqual<JsonPatch[]>([{ op: 'remove', path: '/properties/field' }])
  })

  it('removed and added property with the same id', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.addProperty(object, string)
    root.submitChanges()

    root.removeProperty(object, string)
    const store2 = new StringNodeStore()
    root.setId(store2, 'field')
    root.addProperty(object, store2)

    // TODO move patch?

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'remove', path: '/properties/field' },
      { op: 'add', path: '/properties/field', value: store2.getSchema().getPlainSchema() },
    ])
  })

  it('priority in object patches', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const nestedObject = new ObjectNodeStore()
    root.setId(nestedObject, 'root')
    root.addProperty(object, nestedObject)
    const removedStore = new StringNodeStore()
    const addedStore = new StringNodeStore()
    const changedStore = new StringNodeStore()
    root.setId(removedStore, 'removedStore')
    root.setId(addedStore, 'addedStore')
    root.setId(changedStore, 'changedStore')
    root.addProperty(nestedObject, removedStore)
    root.addProperty(nestedObject, changedStore)
    root.submitChanges()

    root.addProperty(nestedObject, addedStore)
    root.removeProperty(nestedObject, removedStore)
    root.setId(changedStore, 'changedStore2')
    root.setId(nestedObject, 'root2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'add', path: '/properties/root/properties/addedStore', value: addedStore.getSchema().getPlainSchema() },
      { op: 'remove', path: '/properties/root/properties/removedStore' },
      {
        op: 'move',
        from: '/properties/root',
        path: '/properties/root2',
      },
      {
        op: 'move',
        from: '/properties/root2/properties/changedStore',
        path: '/properties/root2/properties/changedStore2',
      },
    ])
  })

  it('changed reference', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.addProperty(object, string)
    root.submitChanges()

    const ref = new StringReferenceNodeStore()
    ref.setReference('User')
    root.setReference(string, ref)
    root.setId(string, 'field2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/field', value: string.getSchema().getPlainSchema() },
      { op: 'move', from: '/properties/field', path: '/properties/field2' },
    ])
    root.submitChanges()

    root.setReferenceValue(ref, 'User2')
    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/field2', value: string.getSchema().getPlainSchema() },
    ])
    root.submitChanges()

    root.setId(string, 'field3')
    root.setReferenceValue(ref, 'User3')
    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/field2', value: string.getSchema().getPlainSchema() },
      { op: 'move', from: '/properties/field2', path: '/properties/field3' },
    ])
  })

  describe('replaceProperty', () => {
    it('replaceProperty', () => {
      const object = new ObjectNodeStore()
      const root = new RootNodeStore(object)
      const string = new StringNodeStore()
      root.setId(string, 'field')
      root.addProperty(object, string)
      root.submitChanges()

      const number = new NumberNodeStore()
      root.replaceProperty(object, string, number)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        { op: 'replace', path: '/properties/field', value: number.getSchema().getPlainSchema() },
      ])
    })

    it('replaceProperty and change id before replacing', () => {
      const object = new ObjectNodeStore()
      const root = new RootNodeStore(object)
      const string = new StringNodeStore()
      root.setId(string, 'field')
      root.addProperty(object, string)
      root.submitChanges()

      root.setId(string, 'field2')
      const number = new NumberNodeStore()
      root.replaceProperty(object, string, number)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        { op: 'replace', path: '/properties/field', value: number.getSchema().getPlainSchema() },
        { op: 'move', from: '/properties/field', path: '/properties/field2' },
      ])
    })

    it('replaceProperty and change id after replacing', () => {
      const object = new ObjectNodeStore()
      const root = new RootNodeStore(object)
      const string = new StringNodeStore()
      root.setId(string, 'field')
      root.addProperty(object, string)
      root.submitChanges()

      const number = new NumberNodeStore()
      root.replaceProperty(object, string, number)
      root.setId(number, 'field2')

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        { op: 'replace', path: '/properties/field', value: number.getSchema().getPlainSchema() },
        { op: 'move', from: '/properties/field', path: '/properties/field2' },
      ])
    })

    it('added and then replace property', () => {
      const root = new RootNodeStore(createSchemaNode(getObjectSchema({})))
      root.submitChanges()

      const object = getObject(root.node)
      const target = createNode<ObjectNodeStore>(getObjectSchema({}), 'target')
      root.addProperty(object, target)
      root.replaceProperty(object, target, new StringNodeStore())

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'add',
          path: '/properties/target',
          value: getStringSchema({}),
        },
      ])
    })

    it('replaced old property with changed children', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            target: getObjectSchema({
              fieldForReplace: getObjectSchema({}),
            }),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const target = object.getProperty<ObjectNodeStore>('target')

      const fieldForReplace = target.getProperty<ObjectNodeStore>('fieldForReplace')
      const str = createNode(getStringSchema(), 'str')
      root.addProperty(fieldForReplace, str)
      root.replaceProperty(fieldForReplace, str, new NumberNodeStore())
      root.replaceProperty(target, fieldForReplace, new BooleanNodeStore())

      const addedProperty = createNode(getStringSchema(), 'addedField')
      root.addProperty(target, addedProperty)
      root.removeProperty(target, addedProperty)

      const array = createNode<ArrayNodeStore>(getArraySchema(getStringSchema()), 'array')
      root.addProperty(target, array)
      const arrayObject = createNode<ObjectNodeStore>(getObjectSchema({}))
      root.replaceItems(array, arrayObject)
      root.addProperty(arrayObject, createNode(getStringSchema(), 'nestedField'))

      root.replaceProperty(object, target, new StringNodeStore())

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'replace',
          path: '/properties/target',
          value: getStringSchema(),
        },
      ])
    })

    it('replaced in moved property #1', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            parent: getObjectSchema({}),
            fieldForReplace: getObjectSchema({}),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const parent = object.getProperty<ObjectNodeStore>('parent')

      const fieldForReplace = object.getProperty<ObjectNodeStore>('fieldForReplace')
      root.addProperty(parent, fieldForReplace)
      root.replaceProperty(parent, fieldForReplace, createNode(getNumberSchema(), 'fieldForReplace'))

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          from: '/properties/fieldForReplace',
          op: 'move',
          path: '/properties/parent/properties/fieldForReplace',
        },
        {
          op: 'replace',
          path: '/properties/parent/properties/fieldForReplace',
          value: getNumberSchema(),
        },
      ])
    })

    it('replaced in moved property #2', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            parent2: getObjectSchema({}),
            parent1: getObjectSchema({
              fieldForReplace: getObjectSchema({}),
            }),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const parent1 = object.getProperty<ObjectNodeStore>('parent1')
      const parent2 = object.getProperty<ObjectNodeStore>('parent2')

      const fieldForReplace = parent1.getProperty<ObjectNodeStore>('fieldForReplace')
      root.addProperty(parent2, parent1)
      root.replaceProperty(parent1, fieldForReplace, createNode(getNumberSchema(), 'fieldForReplace'))

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'move',
          from: '/properties/parent1',
          path: '/properties/parent2/properties/parent1',
        },
        {
          op: 'replace',
          path: '/properties/parent2/properties/parent1/properties/fieldForReplace',
          value: getNumberSchema(),
        },
      ])
    })
  })

  it('replaceProperty from string to string with reference', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.addProperty(object, string)
    root.submitChanges()

    const nextString = new StringNodeStore()
    nextString.setReference(new StringReferenceNodeStore())
    root.replaceProperty(object, string, nextString)
    root.setReferenceValue(nextString.draftReference, 'User')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/field', value: nextString.getSchema().getPlainSchema() },
    ])
  })

  it('replaceProperty from string with reference to string', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.setReference(string, new StringReferenceNodeStore())
    root.setReferenceValue(string.draftReference, 'User')
    root.addProperty(object, string)
    root.submitChanges()

    const nextString = new StringNodeStore()
    root.replaceProperty(object, string, nextString)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/field', value: nextString.getSchema().getPlainSchema() },
    ])
  })

  it('replaceProperty from string with reference to string with another reference', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const string = new StringNodeStore()
    root.setId(string, 'field')
    root.setReference(string, new StringReferenceNodeStore())
    root.setReferenceValue(string.draftReference, 'User')
    root.addProperty(object, string)
    root.submitChanges()

    const nextString = new StringNodeStore()
    nextString.setReference(new StringReferenceNodeStore())
    root.replaceProperty(object, string, nextString)
    root.setReferenceValue(nextString.draftReference, 'User2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/field', value: nextString.getSchema().getPlainSchema() },
    ])
  })

  it('replace items', () => {
    const items = new StringNodeStore()
    const array = new ArrayNodeStore(items)
    const root = new RootNodeStore(array)
    root.submitChanges()

    const nextItems = new ObjectNodeStore()
    root.replaceItems(array, nextItems)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/items', value: nextItems.getSchema().getPlainSchema() },
    ])
  })

  it('replace items and changed id', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const items = new StringNodeStore()
    const array = new ArrayNodeStore(items)
    root.setId(array, 'array')
    root.addProperty(object, array)
    root.submitChanges()

    root.setId(array, 'array2')
    const nextItems = new ObjectNodeStore()
    root.replaceItems(array, nextItems)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/array/items', value: nextItems.getSchema().getPlainSchema() },
      { op: 'move', from: '/properties/array', path: '/properties/array2' },
    ])
  })

  it('changed items', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const items = new ObjectNodeStore()
    const array = new ArrayNodeStore(items)
    root.setId(array, 'array')
    root.addProperty(object, array)
    root.submitChanges()

    const subField = new StringNodeStore()
    root.setId(subField, 'subField')
    root.addProperty(items, subField)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'add', path: '/properties/array/items/properties/subField', value: subField.getSchema().getPlainSchema() },
    ])
  })

  it('changed items and id', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const items = new ObjectNodeStore()
    const array = new ArrayNodeStore(items)
    root.setId(array, 'array')
    root.addProperty(object, array)
    root.submitChanges()

    root.setId(array, 'array2')
    const subField = new StringNodeStore()
    root.setId(subField, 'subField')
    root.addProperty(items, subField)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'add', path: '/properties/array/items/properties/subField', value: subField.getSchema().getPlainSchema() },
      { op: 'move', from: '/properties/array', path: '/properties/array2' },
    ])
  })

  it('changed items and replace items', () => {
    const object = new ObjectNodeStore()
    const root = new RootNodeStore(object)
    const items = new ObjectNodeStore()
    const array = new ArrayNodeStore(items)
    root.setId(array, 'array')
    root.addProperty(object, array)
    root.submitChanges()

    const subField = new StringNodeStore()
    root.setId(subField, 'subField')
    root.addProperty(items, subField)

    const nextItems = new StringNodeStore()
    root.replaceItems(array, nextItems)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/properties/array/items', value: nextItems.getSchema().getPlainSchema() },
    ])
  })

  it('replace items from string to string with reference', () => {
    const items = new StringNodeStore()
    const array = new ArrayNodeStore(items)
    const root = new RootNodeStore(array)
    root.submitChanges()

    const nextItems = new StringNodeStore()
    nextItems.setReference(new StringReferenceNodeStore())
    root.replaceItems(array, nextItems)
    root.setReferenceValue(nextItems.draftReference, 'User')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/items', value: nextItems.getSchema().getPlainSchema() },
    ])
  })

  it('replace items from string with reference to string', () => {
    const items = new StringNodeStore()
    items.setReference(new StringReferenceNodeStore())
    items.draftReference?.setReference('User')
    const array = new ArrayNodeStore(items)
    const root = new RootNodeStore(array)
    root.submitChanges()

    const nextItems = new StringNodeStore()
    root.replaceItems(array, nextItems)

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/items', value: nextItems.getSchema().getPlainSchema() },
    ])
  })

  it('replace items from string with reference to string with another reference', () => {
    const items = new StringNodeStore()
    items.setReference(new StringReferenceNodeStore())
    items.draftReference?.setReference('User')
    const array = new ArrayNodeStore(items)
    const root = new RootNodeStore(array)
    root.submitChanges()

    const nextItems = new StringNodeStore()
    nextItems.setReference(new StringReferenceNodeStore())
    root.replaceItems(array, nextItems)
    root.setReferenceValue(nextItems.draftReference, 'User2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      { op: 'replace', path: '/items', value: nextItems.getSchema().getPlainSchema() },
    ])
  })

  it('complex', () => {
    const rootObject = new ObjectNodeStore()
    const root = new RootNodeStore(rootObject)
    const object = new ObjectNodeStore()
    root.setId(object, 'object')
    root.addProperty(rootObject, object)

    const field1 = new ObjectNodeStore()
    root.setId(field1, 'field1')
    const field2 = new StringNodeStore()
    root.setId(field2, 'field2')
    root.addProperty(object, field1)
    root.addProperty(object, field2)

    const items = new ObjectNodeStore()
    const refField = new StringNodeStore()
    root.setId(refField, 'refField')
    root.setReference(refField, new StringReferenceNodeStore())
    root.setReferenceValue(refField.draftReference, 'User')

    root.addProperty(items, refField)
    const subArray = new ArrayNodeStore(items)
    root.setId(subArray, 'array')
    root.addProperty(field1, subArray)
    root.submitChanges()

    root.setReferenceValue(refField.draftReference, 'User2')
    root.setId(refField, 'refField2')
    const addedSubField = new StringNodeStore()
    root.setId(addedSubField, 'addedSubField')
    root.addProperty(items, addedSubField)
    root.setId(items, 'unnecessaryChangedId')
    root.setId(subArray, 'array2')
    root.setId(field1, 'field1_1')
    root.setId(field2, 'field2_2')
    const nextField2 = new NumberNodeStore()
    root.setId(nextField2, field2.id)
    nextField2.setParent(object)
    nextField2.submitChanges()
    root.replaceProperty(object, field2, nextField2)
    root.setId(object, 'object2')

    expect(root.getPatches()).toEqual<JsonPatch[]>([
      {
        op: 'replace',
        path: '/properties/object/properties/field1/properties/array/items/properties/refField',
        value: getStringSchema({ reference: 'User2' }),
      },
      {
        op: 'add',
        path: '/properties/object/properties/field1/properties/array/items/properties/addedSubField',
        value: getStringSchema(),
      },
      {
        op: 'replace',
        path: '/properties/object/properties/field2',
        value: getNumberSchema(),
      },
      {
        from: '/properties/object',
        op: 'move',
        path: '/properties/object2',
      },
      {
        from: '/properties/object2/properties/field1',
        op: 'move',
        path: '/properties/object2/properties/field1_1',
      },
      {
        from: '/properties/object2/properties/field1_1/properties/array',
        op: 'move',
        path: '/properties/object2/properties/field1_1/properties/array2',
      },
      {
        from: '/properties/object2/properties/field1_1/properties/array2/items/properties/refField',
        op: 'move',
        path: '/properties/object2/properties/field1_1/properties/array2/items/properties/refField2',
      },
      {
        from: '/properties/object2/properties/field2',
        op: 'move',
        path: '/properties/object2/properties/field2_2',
      },
    ])
  })

  describe('special cases', () => {
    it('added in replaced parent (string -> object', () => {
      const object = new ObjectNodeStore()
      const root = new RootNodeStore(object)
      root.setId(object, 'object')
      const field = new StringNodeStore()
      root.setId(field, 'field')
      root.addProperty(object, field)
      root.submitChanges()

      const nextField = createSchemaNode(getObjectSchema({})) as ObjectNodeStore
      root.replaceProperty(object, field, nextField)

      const sub = new StringNodeStore()
      root.setId(sub, 'sub')
      root.addProperty(nextField, sub)

      const nextSub = createSchemaNode(getObjectSchema({})) as ObjectNodeStore
      root.replaceProperty(nextField, sub, nextSub)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'replace',
          path: '/properties/field',
          value: getObjectSchema({}),
        },
        {
          op: 'add',
          path: '/properties/field/properties/sub',
          value: getObjectSchema({}),
        },
      ])
    })

    it('added with same name as previously added and removed node', () => {
      const object = new ObjectNodeStore()
      const root = new RootNodeStore(object)
      root.setId(object, 'object')
      const field1 = new StringNodeStore()
      root.setId(field1, 'field')
      root.addProperty(object, field1)
      const field2 = new StringNodeStore()
      root.setId(field2, 'field')
      root.addProperty(object, field2)
      root.removeProperty(object, field1)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'add',
          path: '/properties/field',
          value: getStringSchema(),
        },
      ])
    })

    it('added field in submitted object and renamed after addProperty', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getObjectSchema({}),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const field = object.getProperty<ObjectNodeStore>('field')
      const nestedField = createNode<ObjectNodeStore>(getStringSchema(), 'nestedField')
      root.addProperty(field, nestedField)
      nestedField.setId('nestedField2')

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'add',
          path: '/properties/field/properties/nestedField2',
          value: getStringSchema(),
        },
      ])
    })

    it('cross moved and replace in the root', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getObjectSchema({
              nestedField: getObjectSchema({}),
            }),
            parent: getObjectSchema({}),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const field = object.getProperty<ObjectNodeStore>('field')
      const parent = object.getProperty<ObjectNodeStore>('parent')
      const nestedField = field.getProperty<ObjectNodeStore>('nestedField')

      root.addProperty(parent, nestedField)
      root.addProperty(nestedField, field)
      root.replaceProperty(object, parent, createNode(getStringSchema()))

      expect(root.getPatches()).toStrictEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/field/properties/nestedField',
        },
        {
          op: 'remove',
          path: '/properties/field',
        },
        {
          op: 'replace',
          path: '/properties/parent',
          value: getStringSchema(),
        },
      ])
    })

    it('cross moved and replace in just added root', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getObjectSchema({
              nestedField: getObjectSchema({}),
            }),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const field = object.getProperty<ObjectNodeStore>('field')
      const parent = createNode<ObjectNodeStore>(getObjectSchema({}), 'parent')
      const nestedField = field.getProperty<ObjectNodeStore>('nestedField')

      root.addProperty(object, parent)
      root.addProperty(parent, nestedField)
      root.addProperty(nestedField, field)
      root.replaceProperty(object, parent, createNode(getStringSchema()))

      expect(root.getPatches()).toStrictEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/field/properties/nestedField',
        },
        {
          op: 'remove',
          path: '/properties/field',
        },
        {
          op: 'add',
          path: '/properties/parent',
          value: getStringSchema(),
        },
      ])
    })

    it('cross moved and remove in the root', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getObjectSchema({
              nestedField: getObjectSchema({}),
            }),
            parent: getObjectSchema({}),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const field = object.getProperty<ObjectNodeStore>('field')
      const parent = object.getProperty<ObjectNodeStore>('parent')
      const nestedField = field.getProperty<ObjectNodeStore>('nestedField')

      root.addProperty(parent, nestedField)
      root.addProperty(nestedField, field)
      root.removeProperty(object, parent)

      expect(root.getPatches()).toStrictEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/field/properties/nestedField',
        },
        {
          op: 'remove',
          path: '/properties/field',
        },
        {
          op: 'remove',
          path: '/properties/parent',
        },
      ])
    })

    it('cross moved and remove in just added root', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            field: getObjectSchema({
              nestedField: getObjectSchema({}),
            }),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const field = object.getProperty<ObjectNodeStore>('field')
      const parent = createNode<ObjectNodeStore>(getObjectSchema({}), 'parent')
      const nestedField = field.getProperty<ObjectNodeStore>('nestedField')

      root.addProperty(object, parent)
      root.addProperty(parent, nestedField)
      root.addProperty(nestedField, field)
      root.removeProperty(object, parent)

      expect(root.getPatches()).toStrictEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/field/properties/nestedField',
        },
        {
          op: 'remove',
          path: '/properties/field',
        },
      ])
    })
  })

  describe('moving to another parent', () => {
    const createStores = () => {
      const object = new ObjectNodeStore()
      const root = new RootNodeStore(object)

      const array = new ArrayNodeStore(new StringNodeStore())
      root.setId(array, 'array')
      object.addProperty(array)

      const field = new StringNodeStore()
      root.setId(field, 'field')
      object.addProperty(field)

      const nestedObject = new ObjectNodeStore()
      root.setId(nestedObject, 'nested')
      object.addProperty(nestedObject)

      const nestedObject2 = new ObjectNodeStore()
      root.setId(nestedObject2, 'nested2')
      object.addProperty(nestedObject2)

      const nestedField = new StringNodeStore()
      root.setId(nestedField, 'field')
      nestedObject.addProperty(nestedField)

      object.submitChanges()

      return {
        root,
        object,
        field,
        nestedObject,
        nestedField,
        nestedObject2,
        array,
      }
    }

    it('a few movements', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            parent1: getObjectSchema({}),
            parent2: getObjectSchema({}),
            field: getStringSchema(),
          }),
        ),
      )
      root.submitChanges()

      const object = root.node as ObjectNodeStore
      const parent1 = object.properties[0] as ObjectNodeStore
      const parent2 = object.properties[1] as ObjectNodeStore
      const field = object.properties[2] as StringNodeStore

      root.addProperty(parent1, field)
      root.addProperty(parent2, field)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'move',
          from: '/properties/field',
          path: '/properties/parent2/properties/field',
        },
      ])
    })

    it('complex movements', () => {
      const root = new RootNodeStore(
        createSchemaNode(
          getObjectSchema({
            parent1: getObjectSchema({
              nested1: getObjectSchema({}),
            }),
            parent2: getObjectSchema({}),
            field: getStringSchema(),
          }),
        ),
      )
      root.submitChanges()

      const object = getObject(root.node)
      const parent1 = object.getProperty<ObjectNodeStore>('parent1')
      const nested1 = parent1.getProperty<ObjectNodeStore>('nested1')
      const parent2 = object.getProperty<ObjectNodeStore>('parent2')
      const field = object.getProperty<StringNodeStore>('field')

      root.addProperty(parent2, nested1)
      root.addProperty(nested1, field)
      root.addProperty(parent1, parent2)
      root.addProperty(object, parent2)
      root.addProperty(parent1, nested1)
      root.addProperty(object, field)

      expect(root.getPatches()).toEqual<JsonPatch[]>([])
    })

    it('from nested object to root object', () => {
      const { root, object, nestedObject, nestedField } = createStores()

      expect(nestedField.parent).toBe(nestedObject)
      expect(nestedField.draftParent).toBe(nestedObject)

      root.addProperty(object, nestedField)
      expect(nestedField.parent).toBe(nestedObject)
      expect(nestedField.draftParent).toBe(object)
      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'move',
          from: '/properties/nested/properties/field',
          path: '/properties/field',
        },
      ])

      root.setId(nestedField, 'field2')

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'move',
          from: '/properties/nested/properties/field',
          path: '/properties/field',
        },
        {
          from: '/properties/field',
          op: 'move',
          path: '/properties/field2',
        },
      ])
    })

    it('from root object to nested object', () => {
      const { root, object, field, nestedObject } = createStores()

      expect(field.parent).toBe(object)
      expect(field.draftParent).toBe(object)

      root.addProperty(nestedObject, field)
      expect(field.parent).toBe(object)
      expect(field.draftParent).toBe(nestedObject)
      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'move',
          from: '/properties/field',
          path: '/properties/nested/properties/field',
        },
      ])

      root.setId(field, 'field2')
      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'move',
          from: '/properties/field',
          path: '/properties/nested/properties/field',
        },
        {
          from: '/properties/nested/properties/field',
          op: 'move',
          path: '/properties/nested/properties/field2',
        },
      ])
    })

    it('from root object to just created nested object', () => {
      const { root, object, field } = createStores()

      const nestedObject2 = new ObjectNodeStore()
      root.setId(nestedObject2, 'nested2')
      root.addProperty(object, nestedObject2)

      root.addProperty(nestedObject2, field)
      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'add',
          path: '/properties/nested2',
          value: {
            additionalProperties: false,
            properties: {},
            required: [],
            type: JsonSchemaTypeName.Object,
          },
        },
        {
          op: 'move',
          from: '/properties/field',
          path: '/properties/nested2/properties/field',
        },
      ])

      root.setId(field, 'field2')
      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'add',
          path: '/properties/nested2',
          value: {
            additionalProperties: false,
            properties: {},
            required: [],
            type: JsonSchemaTypeName.Object,
          },
        },
        {
          op: 'move',
          from: '/properties/field',
          path: '/properties/nested2/properties/field',
        },
        {
          from: '/properties/nested2/properties/field',
          op: 'move',
          path: '/properties/nested2/properties/field2',
        },
      ])
    })

    it('from root object to just removed nested object', () => {
      const { root, object, field, nestedObject } = createStores()

      root.addProperty(nestedObject, field)
      root.removeProperty(object, nestedObject)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/field',
        },
        {
          op: 'remove',
          path: '/properties/nested',
        },
      ])

      root.setId(field, 'field2')
      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'remove',
          path: '/properties/field',
        },
        {
          op: 'remove',
          path: '/properties/nested',
        },
      ])
    })

    it('from nested object to nested object', () => {
      const { root, nestedField, nestedObject2 } = createStores()

      root.addProperty(nestedObject2, nestedField)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          from: '/properties/nested/properties/field',
          op: 'move',
          path: '/properties/nested2/properties/field',
        },
      ])
    })

    it('from nested object to nested object and return', () => {
      const { root, nestedField, nestedObject, nestedObject2 } = createStores()

      root.addProperty(nestedObject2, nestedField)
      root.addProperty(nestedObject, nestedField)

      expect(root.getPatches()).toEqual<JsonPatch[]>([])
    })

    it('depends on nested moved', () => {
      const { root, nestedField, nestedObject, nestedObject2 } = createStores()

      root.addProperty(nestedObject2, nestedObject)
      root.addProperty(nestedObject2, nestedField)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        { op: 'move', from: '/properties/nested', path: '/properties/nested2/properties/nested' },
        { op: 'move', from: '/properties/nested/properties/field', path: '/properties/nested2/properties/field' },
      ])
    })

    it('moved to added in replaced parent', () => {
      const { root, object, field, nestedObject } = createStores()

      const nextField = new ObjectNodeStore()
      root.replaceProperty(object, field, nextField)

      const subObject = new StringNodeStore()
      root.setId(subObject, 'subObject')
      root.addProperty(nextField, subObject)

      const nextSubObject = new ObjectNodeStore()
      root.replaceProperty(nextField, subObject, nextSubObject)
      root.addProperty(nextSubObject, nestedObject)
      root.removeProperty(nextSubObject, nestedObject)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          op: 'replace',
          path: '/properties/field',
          value: getObjectSchema({}),
        },
        {
          op: 'add',
          path: '/properties/field/properties/subObject',
          value: getObjectSchema({}),
        },
        {
          op: 'remove',
          path: '/properties/nested',
        },
        {
          op: 'remove',
          path: '/properties/field/properties/subObject/properties/nested',
        },
      ])
    })

    xit('from nested object to just created root object', () => {})

    xit('from nested object to just removed root object', () => {})

    xit('from just removed nested object to just created root object', () => {})

    xit('from just removed nested object to just removed root object', () => {})

    xit('from just removed root object to just created nested object', () => {})

    xit('from just removed root object to just removed nested object', () => {})

    it('from nested object to array items', () => {
      const { root, array, nestedField, nestedObject } = createStores()

      expect(nestedObject.hasProperty(nestedField)).toBe(true)
      root.replaceItems(array, nestedField)
      expect(nestedObject.hasProperty(nestedField)).toBe(false)

      expect(root.getPatches()).toEqual<JsonPatch[]>([
        {
          from: '/properties/nested/properties/field',
          op: 'move',
          path: '/properties/array/items',
        },
      ])
    })
  })
})

const getObject = (node): ObjectNodeStore => {
  if (node instanceof ObjectNodeStore) {
    return node
  }

  throw new Error('Invalid node')
}

export const createNode = <T extends SchemaNode>(schema: JsonSchema, rootId: string = ''): T => {
  const store = createSchemaNode(schema)
  store.setId(rootId)
  return store as T
}
