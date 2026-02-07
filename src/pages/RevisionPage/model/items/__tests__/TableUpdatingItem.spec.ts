import { TableUpdatingItem } from '../TableUpdatingItem.ts'
import { TableStackItemType } from '../../../config/types.ts'
import { createMockUpdatingDeps } from '../../__tests__/createMockDeps.ts'
import { JsonSchemaTypeName, type JsonObjectSchema } from '@revisium/schema-toolkit-ui'

const createSchema = (): JsonObjectSchema => ({
  type: JsonSchemaTypeName.Object,
  properties: {},
  additionalProperties: false,
  required: [],
})

describe('TableUpdatingItem', () => {
  describe('initialization', () => {
    it('should create with Updating type', () => {
      const deps = createMockUpdatingDeps()
      const schema = createSchema()
      const item = new TableUpdatingItem(deps, false, schema, 'table-1')

      expect(item.type).toBe(TableStackItemType.Updating)
    })

    it('should create SchemaEditorVM with provided schema and tableId', () => {
      const deps = createMockUpdatingDeps()
      const schema = createSchema()
      const item = new TableUpdatingItem(deps, false, schema, 'table-1')

      expect(item.viewModel).toBeDefined()
      expect(item.viewModel.tableId).toBe('table-1')
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockUpdatingDeps()
      const schema = createSchema()

      const item1 = new TableUpdatingItem(deps, false, schema, 'table-1')
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new TableUpdatingItem(deps, true, schema, 'table-1')
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockUpdatingDeps()
      const schema = createSchema()
      const item1 = new TableUpdatingItem(deps, false, schema, 'table-1')
      const item2 = new TableUpdatingItem(deps, false, schema, 'table-1')

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockUpdatingDeps()
      const schema = createSchema()
      const item = new TableUpdatingItem(deps, false, schema, 'table-1')

      item.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalled()
    })
  })
})
