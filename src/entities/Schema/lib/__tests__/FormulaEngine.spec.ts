import { runInAction } from 'mobx'
import { JsonFormulaSpec, JsonObjectSchema, JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore'
import { FormulaEngine } from 'src/entities/Schema/lib/FormulaEngine'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { JsonObject } from 'src/entities/Schema/types/json.types'

const createFormula = (expression: string): JsonFormulaSpec => ({
  version: 1,
  expression,
})

const createSchema = (properties: Record<string, JsonSchema>): JsonObjectStore => {
  const schema: JsonObjectSchema = {
    type: JsonSchemaTypeName.Object,
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
  }
  return createJsonSchemaStore(schema) as JsonObjectStore
}

const createValueStore = (schema: JsonObjectStore, data: JsonObject): JsonObjectValueStore => {
  return createJsonValueStore(schema, 'test-row', data) as JsonObjectValueStore
}

describe('FormulaEngine', () => {
  describe('simple formulas', () => {
    it('should evaluate formula on initialization', () => {
      const schema = createSchema({
        a: { type: JsonSchemaTypeName.Number, default: 0 },
        b: { type: JsonSchemaTypeName.Number, default: 0 },
        sum: { type: JsonSchemaTypeName.Number, default: 0, readOnly: true, 'x-formula': createFormula('a + b') },
      })

      const store = createValueStore(schema, { a: 10, b: 20, sum: 0 })
      const engine = new FormulaEngine(store)

      const sumStore = store.value['sum'] as JsonNumberValueStore
      expect(sumStore.value).toBe(30)

      engine.dispose()
    })

    it('should recalculate when dependency changes', () => {
      const schema = createSchema({
        a: { type: JsonSchemaTypeName.Number, default: 0 },
        b: { type: JsonSchemaTypeName.Number, default: 0 },
        sum: { type: JsonSchemaTypeName.Number, default: 0, readOnly: true, 'x-formula': createFormula('a + b') },
      })

      const store = createValueStore(schema, { a: 10, b: 20, sum: 0 })
      const engine = new FormulaEngine(store)

      const aStore = store.value['a'] as JsonNumberValueStore
      const sumStore = store.value['sum'] as JsonNumberValueStore

      expect(sumStore.value).toBe(30)

      runInAction(() => {
        aStore.value = 50
      })
      expect(sumStore.value).toBe(70)

      engine.dispose()
    })

    it('should handle string formulas', () => {
      const schema = createSchema({
        firstName: { type: JsonSchemaTypeName.String, default: '' },
        lastName: { type: JsonSchemaTypeName.String, default: '' },
        fullName: {
          type: JsonSchemaTypeName.String,
          default: '',
          readOnly: true,
          'x-formula': createFormula('firstName + " " + lastName'),
        },
      })

      const store = createValueStore(schema, { firstName: 'John', lastName: 'Doe', fullName: '' })
      const engine = new FormulaEngine(store)

      const fullNameStore = store.value['fullName']
      expect(fullNameStore.value).toBe('John Doe')

      engine.dispose()
    })

    it('should handle boolean formulas', () => {
      const schema = createSchema({
        value: { type: JsonSchemaTypeName.Number, default: 0 },
        isPositive: {
          type: JsonSchemaTypeName.Boolean,
          default: false,
          readOnly: true,
          'x-formula': createFormula('value > 0'),
        },
      })

      const store = createValueStore(schema, { value: 10, isPositive: false })
      const engine = new FormulaEngine(store)

      const isPositiveStore = store.value['isPositive']
      expect(isPositiveStore.value).toBe(true)

      const valueStore = store.value['value'] as JsonNumberValueStore
      runInAction(() => {
        valueStore.value = -5
      })
      expect(isPositiveStore.value).toBe(false)

      engine.dispose()
    })
  })

  describe('chained formulas', () => {
    it('should evaluate formulas in correct order', () => {
      const schema = createSchema({
        a: { type: JsonSchemaTypeName.Number, default: 0 },
        b: { type: JsonSchemaTypeName.Number, default: 0, readOnly: true, 'x-formula': createFormula('a * 2') },
        c: { type: JsonSchemaTypeName.Number, default: 0, readOnly: true, 'x-formula': createFormula('b + 10') },
      })

      const store = createValueStore(schema, { a: 5, b: 0, c: 0 })
      const engine = new FormulaEngine(store)

      const bStore = store.value['b'] as JsonNumberValueStore
      const cStore = store.value['c'] as JsonNumberValueStore

      expect(bStore.value).toBe(10)
      expect(cStore.value).toBe(20)

      const aStore = store.value['a'] as JsonNumberValueStore
      runInAction(() => {
        aStore.value = 10
      })

      expect(bStore.value).toBe(20)
      expect(cStore.value).toBe(30)

      engine.dispose()
    })

    it('should handle multiple dependencies', () => {
      const schema = createSchema({
        price: { type: JsonSchemaTypeName.Number, default: 0 },
        quantity: { type: JsonSchemaTypeName.Number, default: 0 },
        discount: { type: JsonSchemaTypeName.Number, default: 0 },
        subtotal: {
          type: JsonSchemaTypeName.Number,
          default: 0,
          readOnly: true,
          'x-formula': createFormula('price * quantity'),
        },
        total: {
          type: JsonSchemaTypeName.Number,
          default: 0,
          readOnly: true,
          'x-formula': createFormula('subtotal - discount'),
        },
      })

      const store = createValueStore(schema, { price: 100, quantity: 3, discount: 50, subtotal: 0, total: 0 })
      const engine = new FormulaEngine(store)

      const subtotalStore = store.value['subtotal'] as JsonNumberValueStore
      const totalStore = store.value['total'] as JsonNumberValueStore

      expect(subtotalStore.value).toBe(300)
      expect(totalStore.value).toBe(250)

      engine.dispose()
    })
  })

  describe('nested object formulas', () => {
    it('should evaluate formulas in nested objects', () => {
      const schema = createSchema({
        nested: {
          type: JsonSchemaTypeName.Object,
          additionalProperties: false,
          required: ['value', 'doubled'],
          properties: {
            value: { type: JsonSchemaTypeName.Number, default: 0 },
            doubled: {
              type: JsonSchemaTypeName.Number,
              default: 0,
              readOnly: true,
              'x-formula': createFormula('value * 2'),
            },
          },
        },
      })

      const store = createValueStore(schema, { nested: { value: 5, doubled: 0 } })
      const engine = new FormulaEngine(store)

      const nestedStore = store.value['nested'] as JsonObjectValueStore
      const doubledStore = nestedStore.value['doubled'] as JsonNumberValueStore

      expect(doubledStore.value).toBe(10)

      const valueStore = nestedStore.value['value'] as JsonNumberValueStore
      runInAction(() => {
        valueStore.value = 15
      })
      expect(doubledStore.value).toBe(30)

      engine.dispose()
    })

    it('should access root fields from nested formula using absolute path', () => {
      const schema = createSchema({
        multiplier: { type: JsonSchemaTypeName.Number, default: 1 },
        nested: {
          type: JsonSchemaTypeName.Object,
          additionalProperties: false,
          required: ['value', 'result'],
          properties: {
            value: { type: JsonSchemaTypeName.Number, default: 0 },
            result: {
              type: JsonSchemaTypeName.Number,
              default: 0,
              readOnly: true,
              'x-formula': createFormula('value * /multiplier'),
            },
          },
        },
      })

      const store = createValueStore(schema, { multiplier: 10, nested: { value: 5, result: 0 } })
      const engine = new FormulaEngine(store)

      const nestedStore = store.value['nested'] as JsonObjectValueStore
      const resultStore = nestedStore.value['result'] as JsonNumberValueStore

      expect(resultStore.value).toBe(50)

      engine.dispose()
    })
  })

  describe('array formulas', () => {
    it('should evaluate formulas in array items', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['price', 'quantity', 'total'],
            properties: {
              price: { type: JsonSchemaTypeName.Number, default: 0 },
              quantity: { type: JsonSchemaTypeName.Number, default: 0 },
              total: {
                type: JsonSchemaTypeName.Number,
                default: 0,
                readOnly: true,
                'x-formula': createFormula('price * quantity'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        items: [
          { price: 10, quantity: 2, total: 0 },
          { price: 20, quantity: 3, total: 0 },
        ],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore
      const item0 = itemsStore.value[0] as JsonObjectValueStore
      const item1 = itemsStore.value[1] as JsonObjectValueStore

      expect((item0.value['total'] as JsonNumberValueStore).value).toBe(20)
      expect((item1.value['total'] as JsonNumberValueStore).value).toBe(60)

      const priceStore = item0.value['price'] as JsonNumberValueStore
      runInAction(() => {
        priceStore.value = 50
      })
      expect((item0.value['total'] as JsonNumberValueStore).value).toBe(100)

      engine.dispose()
    })

    it('should reinitialize when array structure changes', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['value', 'doubled'],
            properties: {
              value: { type: JsonSchemaTypeName.Number, default: 0 },
              doubled: {
                type: JsonSchemaTypeName.Number,
                default: 0,
                readOnly: true,
                'x-formula': createFormula('value * 2'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        items: [{ value: 5, doubled: 0 }],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore

      const newItem = itemsStore.createItem() as JsonObjectValueStore
      const valueStore = newItem.value['value'] as JsonNumberValueStore
      runInAction(() => {
        valueStore.value = 10
      })

      expect((newItem.value['doubled'] as JsonNumberValueStore).value).toBe(20)

      engine.dispose()
    })
  })

  describe('dispose', () => {
    it('should stop reacting to changes after dispose', () => {
      const schema = createSchema({
        a: { type: JsonSchemaTypeName.Number, default: 0 },
        b: { type: JsonSchemaTypeName.Number, default: 0, readOnly: true, 'x-formula': createFormula('a * 2') },
      })

      const store = createValueStore(schema, { a: 5, b: 0 })
      const engine = new FormulaEngine(store)

      const aStore = store.value['a'] as JsonNumberValueStore
      const bStore = store.value['b'] as JsonNumberValueStore

      expect(bStore.value).toBe(10)

      engine.dispose()

      aStore.value = 100
      expect(bStore.value).toBe(10)
    })
  })

  describe('reinitialize', () => {
    it('should recalculate all formulas', () => {
      const schema = createSchema({
        a: { type: JsonSchemaTypeName.Number, default: 0 },
        b: { type: JsonSchemaTypeName.Number, default: 0, readOnly: true, 'x-formula': createFormula('a + 100') },
      })

      const store = createValueStore(schema, { a: 5, b: 0 })
      const engine = new FormulaEngine(store)

      expect((store.value['b'] as JsonNumberValueStore).value).toBe(105)

      const aStore = store.value['a'] as JsonNumberValueStore
      runInAction(() => {
        aStore.value = 20
      })

      engine.reinitialize()

      expect((store.value['b'] as JsonNumberValueStore).value).toBe(120)

      engine.dispose()
    })
  })

  describe('array context tokens', () => {
    it('should compute #index in array items', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['name', 'position'],
            properties: {
              name: { type: JsonSchemaTypeName.String, default: '' },
              position: {
                type: JsonSchemaTypeName.Number,
                default: 0,
                readOnly: true,
                'x-formula': createFormula('#index + 1'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        items: [
          { name: 'First', position: 0 },
          { name: 'Second', position: 0 },
          { name: 'Third', position: 0 },
        ],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore
      const item0 = itemsStore.value[0] as JsonObjectValueStore
      const item1 = itemsStore.value[1] as JsonObjectValueStore
      const item2 = itemsStore.value[2] as JsonObjectValueStore

      expect((item0.value['position'] as JsonNumberValueStore).value).toBe(1)
      expect((item1.value['position'] as JsonNumberValueStore).value).toBe(2)
      expect((item2.value['position'] as JsonNumberValueStore).value).toBe(3)

      engine.dispose()
    })

    it('should compute #length in array items', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['value', 'total'],
            properties: {
              value: { type: JsonSchemaTypeName.Number, default: 0 },
              total: {
                type: JsonSchemaTypeName.Number,
                default: 0,
                readOnly: true,
                'x-formula': createFormula('#length'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        items: [
          { value: 10, total: 0 },
          { value: 20, total: 0 },
          { value: 30, total: 0 },
        ],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore
      const item0 = itemsStore.value[0] as JsonObjectValueStore
      const item1 = itemsStore.value[1] as JsonObjectValueStore
      const item2 = itemsStore.value[2] as JsonObjectValueStore

      expect((item0.value['total'] as JsonNumberValueStore).value).toBe(3)
      expect((item1.value['total'] as JsonNumberValueStore).value).toBe(3)
      expect((item2.value['total'] as JsonNumberValueStore).value).toBe(3)

      engine.dispose()
    })

    it('should compute @prev neighbor reference', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['value', 'prevValue'],
            properties: {
              value: { type: JsonSchemaTypeName.Number, default: 0 },
              prevValue: {
                type: JsonSchemaTypeName.Number,
                default: 0,
                readOnly: true,
                'x-formula': createFormula('if(isnull(@prev), 0, @prev.value)'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        items: [
          { value: 10, prevValue: 0 },
          { value: 20, prevValue: 0 },
          { value: 30, prevValue: 0 },
        ],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore
      const item0 = itemsStore.value[0] as JsonObjectValueStore
      const item1 = itemsStore.value[1] as JsonObjectValueStore
      const item2 = itemsStore.value[2] as JsonObjectValueStore

      expect((item0.value['prevValue'] as JsonNumberValueStore).value).toBe(0)
      expect((item1.value['prevValue'] as JsonNumberValueStore).value).toBe(10)
      expect((item2.value['prevValue'] as JsonNumberValueStore).value).toBe(20)

      engine.dispose()
    })

    it('should compute #first and #last in array items', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['value', 'isFirst', 'isLast'],
            properties: {
              value: { type: JsonSchemaTypeName.Number, default: 0 },
              isFirst: {
                type: JsonSchemaTypeName.Boolean,
                default: false,
                readOnly: true,
                'x-formula': createFormula('#first'),
              },
              isLast: {
                type: JsonSchemaTypeName.Boolean,
                default: false,
                readOnly: true,
                'x-formula': createFormula('#last'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        items: [
          { value: 1, isFirst: false, isLast: false },
          { value: 2, isFirst: false, isLast: false },
          { value: 3, isFirst: false, isLast: false },
        ],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore
      const item0 = itemsStore.value[0] as JsonObjectValueStore
      const item1 = itemsStore.value[1] as JsonObjectValueStore
      const item2 = itemsStore.value[2] as JsonObjectValueStore

      expect(item0.value['isFirst'].value).toBe(true)
      expect(item0.value['isLast'].value).toBe(false)
      expect(item1.value['isFirst'].value).toBe(false)
      expect(item1.value['isLast'].value).toBe(false)
      expect(item2.value['isFirst'].value).toBe(false)
      expect(item2.value['isLast'].value).toBe(true)

      engine.dispose()
    })

    it('should compute formula with root path and array context', () => {
      const schema = createSchema({
        baseValue: { type: JsonSchemaTypeName.Number, default: 0 },
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['exp'],
            properties: {
              exp: {
                type: JsonSchemaTypeName.Number,
                default: 0,
                readOnly: true,
                'x-formula': createFormula('/baseValue + #index * 10'),
              },
            },
          },
        },
      })

      const store = createValueStore(schema, {
        baseValue: 100,
        items: [{ exp: 0 }, { exp: 0 }, { exp: 0 }],
      })
      const engine = new FormulaEngine(store)

      const itemsStore = store.value['items'] as JsonArrayValueStore
      const item0 = itemsStore.value[0] as JsonObjectValueStore
      const item1 = itemsStore.value[1] as JsonObjectValueStore
      const item2 = itemsStore.value[2] as JsonObjectValueStore

      expect((item0.value['exp'] as JsonNumberValueStore).value).toBe(100)
      expect((item1.value['exp'] as JsonNumberValueStore).value).toBe(110)
      expect((item2.value['exp'] as JsonNumberValueStore).value).toBe(120)

      engine.dispose()
    })
  })
})
