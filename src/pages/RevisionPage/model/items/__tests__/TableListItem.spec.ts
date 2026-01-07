import { TableListItem } from '../TableListItem.ts'
import { TableStackItemType } from '../../../config/types.ts'
import { createMockBaseDeps } from '../../__tests__/createMockDeps.ts'

describe('TableListItem', () => {
  describe('initialization', () => {
    it('should create with List type', () => {
      const deps = createMockBaseDeps()
      const item = new TableListItem(deps, false)

      expect(item.type).toBe(TableStackItemType.List)
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockBaseDeps()

      const item1 = new TableListItem(deps, false)
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new TableListItem(deps, true)
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockBaseDeps()
      const item1 = new TableListItem(deps, false)
      const item2 = new TableListItem(deps, false)

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('computed properties', () => {
    it('should return isEditableRevision from projectContext', () => {
      const deps1 = createMockBaseDeps({ isDraftRevision: true })
      const item1 = new TableListItem(deps1, false)
      expect(item1.isEditableRevision).toBe(true)

      const deps2 = createMockBaseDeps({ isDraftRevision: false })
      const item2 = new TableListItem(deps2, false)
      expect(item2.isEditableRevision).toBe(false)
    })

    it('should return revisionId from projectContext', () => {
      const deps = createMockBaseDeps()
      const item = new TableListItem(deps, false)

      expect(item.revisionId).toBe('rev-1')
    })

    it('should return canCreateTable based on permissions and editable state', () => {
      const deps1 = createMockBaseDeps({ isDraftRevision: true, canCreateTable: true })
      const item1 = new TableListItem(deps1, false)
      expect(item1.canCreateTable).toBe(true)

      const deps2 = createMockBaseDeps({ isDraftRevision: false, canCreateTable: true })
      const item2 = new TableListItem(deps2, false)
      expect(item2.canCreateTable).toBe(false)

      const deps3 = createMockBaseDeps({ isDraftRevision: true, canCreateTable: false })
      const item3 = new TableListItem(deps3, false)
      expect(item3.canCreateTable).toBe(false)
    })
  })

  describe('actions', () => {
    it('toCreating should resolve with toCreating type', () => {
      const deps = createMockBaseDeps()
      const item = new TableListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toCreating()

      expect(resolver).toHaveBeenCalledWith({ type: 'toCreating' })
    })

    it('toCloning should resolve with toCloning type and tableId', () => {
      const deps = createMockBaseDeps()
      const item = new TableListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toCloning('table-1')

      expect(resolver).toHaveBeenCalledWith({ type: 'toCloning', tableId: 'table-1' })
    })

    it('toUpdating should resolve with toUpdating type and tableId', () => {
      const deps = createMockBaseDeps()
      const item = new TableListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toUpdating('table-1')

      expect(resolver).toHaveBeenCalledWith({ type: 'toUpdating', tableId: 'table-1' })
    })

    it('selectTable should resolve with selectTable type and tableId', () => {
      const deps = createMockBaseDeps()
      const item = new TableListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.selectTable('table-1')

      expect(resolver).toHaveBeenCalledWith({ type: 'selectTable', tableId: 'table-1' })
    })
  })
})
