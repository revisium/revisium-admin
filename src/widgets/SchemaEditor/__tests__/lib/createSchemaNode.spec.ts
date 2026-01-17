import { JsonSchemaTypeName, JsonStringSchema } from 'src/entities/Schema'
import {
  getArraySchema,
  getBooleanSchema,
  getNumberSchema,
  getObjectSchema,
  getStringSchema,
} from 'src/__tests__/utils/schema/schema.mocks.ts'
import { createSchemaNode } from 'src/widgets/SchemaEditor/lib/createSchemaNode.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { NumberNodeStore } from 'src/widgets/SchemaEditor/model/NumberNodeStore.ts'
import { BooleanNodeStore } from 'src/widgets/SchemaEditor/model/BooleanNodeStore.ts'

describe('createSchemaNode', () => {
  it('complex', () => {
    const schema = getObjectSchema({
      fieldStr: getStringSchema(),
      fieldRef: getStringSchema({ foreignKey: 'User' }),
      fieldNested: getObjectSchema({
        subField: getStringSchema(),
      }),
      arrayObjects: getArraySchema(
        getArraySchema(
          getObjectSchema({
            ref: getStringSchema({ foreignKey: 'Post' }),
            num: getNumberSchema(),
            bool: getBooleanSchema(),
          }),
        ),
      ),
      arrayIds: getArraySchema(getStringSchema()),
    })

    const store = createSchemaNode(schema)
    store.setId('rootId')
    store.submitChanges()

    expect(store.isDirtyItself).toBe(false)
    expect(store.isDirty).toBe(false)
    expect(store.getSchema()).toEqual(schema)
    expect(store.draftId).toEqual('rootId')
  })

  describe('formula loading', () => {
    it('loads formula from string field', () => {
      const schema = getObjectSchema({
        name: getStringSchema(),
        calculated: {
          type: JsonSchemaTypeName.String,
          default: '',
          'x-formula': { version: 1, expression: 'UPPER(name)' },
          readOnly: true,
        } as JsonStringSchema,
      })

      const store = createSchemaNode(schema) as ObjectNodeStore

      const calculatedNode = store.draftProperties.find((p) => p.draftId === 'calculated') as StringNodeStore
      expect(calculatedNode).toBeDefined()

      // Before submitChanges: formula is in draft but not in model
      expect(calculatedNode.draftFormula).toBe('UPPER(name)')
      expect(calculatedNode.formula).toBe('')
      expect(calculatedNode.isDirty).toBe(true)

      store.submitChanges()

      // After submitChanges: formula is in both
      expect(calculatedNode.draftFormula).toBe('UPPER(name)')
      expect(calculatedNode.formula).toBe('UPPER(name)')
      expect(calculatedNode.isDirty).toBe(false)
    })

    it('loads formula from number field', () => {
      const schema = getObjectSchema({
        price: getNumberSchema(),
        total: {
          type: JsonSchemaTypeName.Number,
          default: 0,
          'x-formula': { version: 1, expression: 'price * 2' },
          readOnly: true,
        },
      })

      const store = createSchemaNode(schema) as ObjectNodeStore
      store.submitChanges()

      const totalNode = store.draftProperties.find((p) => p.draftId === 'total') as NumberNodeStore
      expect(totalNode.draftFormula).toBe('price * 2')
      expect(totalNode.formula).toBe('price * 2')
      expect(totalNode.isDirty).toBe(false)
    })

    it('loads formula from boolean field', () => {
      const schema = getObjectSchema({
        price: getNumberSchema(),
        isExpensive: {
          type: JsonSchemaTypeName.Boolean,
          default: false,
          'x-formula': { version: 1, expression: 'price > 100' },
          readOnly: true,
        },
      })

      const store = createSchemaNode(schema) as ObjectNodeStore
      store.submitChanges()

      const isExpensiveNode = store.draftProperties.find((p) => p.draftId === 'isExpensive') as BooleanNodeStore
      expect(isExpensiveNode.draftFormula).toBe('price > 100')
      expect(isExpensiveNode.formula).toBe('price > 100')
      expect(isExpensiveNode.isDirty).toBe(false)
    })

    it('after submitChanges modifying formula marks node as dirty', () => {
      const schema = getObjectSchema({
        name: getStringSchema(),
        calculated: {
          type: JsonSchemaTypeName.String,
          default: '',
          'x-formula': { version: 1, expression: 'UPPER(name)' },
          readOnly: true,
        } as JsonStringSchema,
      })

      const store = createSchemaNode(schema) as ObjectNodeStore
      store.submitChanges()

      const calculatedNode = store.draftProperties.find((p) => p.draftId === 'calculated') as StringNodeStore
      expect(calculatedNode.isDirty).toBe(false)

      calculatedNode.setFormula('LOWER(name)')
      expect(calculatedNode.isDirty).toBe(true)
      expect(calculatedNode.draftFormula).toBe('LOWER(name)')
      expect(calculatedNode.formula).toBe('UPPER(name)')
    })
  })
})
