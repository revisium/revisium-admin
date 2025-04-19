import {
  getArraySchema,
  getBooleanSchema,
  getNumberSchema,
  getObjectSchema,
  getStringSchema,
} from 'src/__tests__/utils/schema/schema.mocks.ts'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'

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
})
