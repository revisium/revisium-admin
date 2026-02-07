import { JsonSchemaTypeName, type JsonObjectSchema } from '@revisium/schema-toolkit-ui'
import { TableCreatingItem } from '../TableCreatingItem.ts'
import { TableStackItemType } from '../../../config/types.ts'
import { createMockCreatingDeps } from '../../__tests__/createMockDeps.ts'

describe('TableCreatingItem', () => {
  describe('initialization', () => {
    it('should create with Creating type', () => {
      const deps = createMockCreatingDeps()
      const item = new TableCreatingItem(deps, false)

      expect(item.type).toBe(TableStackItemType.Creating)
    })

    it('should create with new SchemaEditorVM by default', () => {
      const deps = createMockCreatingDeps()
      const item = new TableCreatingItem(deps, false)

      expect(item.viewModel).toBeDefined()
      expect(item.viewModel.tableId).toBe('')
    })

    it('should use provided tableId', () => {
      const deps = createMockCreatingDeps()
      const schema: JsonObjectSchema = {
        type: JsonSchemaTypeName.Object,
        properties: {},
        additionalProperties: false,
        required: [],
      }
      const item = new TableCreatingItem(deps, false, schema, 'my-table')

      expect(item.viewModel.tableId).toBe('my-table')
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockCreatingDeps()

      const item1 = new TableCreatingItem(deps, false)
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new TableCreatingItem(deps, true)
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockCreatingDeps()
      const item1 = new TableCreatingItem(deps, false)
      const item2 = new TableCreatingItem(deps, false)

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('toUpdating', () => {
    it('should resolve with creatingToUpdating type', () => {
      const deps = createMockCreatingDeps()
      const item = new TableCreatingItem(deps, false)

      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toUpdating()

      expect(resolver).toHaveBeenCalledWith({ type: 'creatingToUpdating' })
    })
  })

  describe('selectTable', () => {
    it('should resolve with selectTable type and tableId', () => {
      const deps = createMockCreatingDeps()
      const item = new TableCreatingItem(deps, true)

      const resolver = jest.fn()
      item.setResolver(resolver)

      item.selectTable('selected-table')

      expect(resolver).toHaveBeenCalledWith({ type: 'selectTable', tableId: 'selected-table' })
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockCreatingDeps()
      const item = new TableCreatingItem(deps, false)

      item.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalled()
    })
  })
})
