import { RowListItem } from '../RowListItem.ts'
import { RowStackItemType } from '../../../config/types.ts'
import { createMockBaseDeps } from '../../__tests__/createMockDeps.ts'

describe('RowListItem', () => {
  describe('initialization', () => {
    it('should create with List type', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)

      expect(item.type).toBe(RowStackItemType.List)
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockBaseDeps()

      const item1 = new RowListItem(deps, false)
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new RowListItem(deps, true)
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockBaseDeps()
      const item1 = new RowListItem(deps, false)
      const item2 = new RowListItem(deps, false)

      expect(item1.id).not.toEqual(item2.id)
    })

    it('should set tableId from deps', () => {
      const deps = createMockBaseDeps({ tableId: 'my-table' })
      const item = new RowListItem(deps, false)

      expect(item.tableId).toBe('my-table')
    })
  })

  describe('computed properties', () => {
    it('should return isEditableRevision from projectContext', () => {
      const deps1 = createMockBaseDeps({ isDraftRevision: true })
      const item1 = new RowListItem(deps1, false)
      expect(item1.isEditableRevision).toBe(true)

      const deps2 = createMockBaseDeps({ isDraftRevision: false })
      const item2 = new RowListItem(deps2, false)
      expect(item2.isEditableRevision).toBe(false)
    })

    it('should return revisionId from projectContext', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)

      expect(item.revisionId).toBe('rev-1')
    })

    it('should return canCreateRow based on permissions and editable state', () => {
      const deps1 = createMockBaseDeps({ isDraftRevision: true, canCreateRow: true })
      const item1 = new RowListItem(deps1, false)
      expect(item1.canCreateRow).toBe(true)

      const deps2 = createMockBaseDeps({ isDraftRevision: false, canCreateRow: true })
      const item2 = new RowListItem(deps2, false)
      expect(item2.canCreateRow).toBe(false)

      const deps3 = createMockBaseDeps({ isDraftRevision: true, canCreateRow: false })
      const item3 = new RowListItem(deps3, false)
      expect(item3.canCreateRow).toBe(false)
    })
  })

  describe('actions', () => {
    it('toCreating should resolve with toCreating type', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toCreating()

      expect(resolver).toHaveBeenCalledWith({ type: 'toCreating' })
    })

    it('toCloning should resolve with toCloning type and rowId', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toCloning('row-1')

      expect(resolver).toHaveBeenCalledWith({ type: 'toCloning', rowId: 'row-1' })
    })

    it('toUpdating should resolve with toUpdating type and rowId', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.toUpdating('row-1')

      expect(resolver).toHaveBeenCalledWith({ type: 'toUpdating', rowId: 'row-1' })
    })

    it('selectRow should resolve with selectRow type and rowId', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)
      const resolver = jest.fn()
      item.setResolver(resolver)

      item.selectRow('row-1')

      expect(resolver).toHaveBeenCalledWith({ type: 'selectRow', rowId: 'row-1' })
    })
  })

  describe('isFirstLevel', () => {
    it('should default to false', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)

      expect(item.isFirstLevel).toBe(false)
    })

    it('should be settable', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)

      item.setIsFirstLevel(true)

      expect(item.isFirstLevel).toBe(true)
    })
  })

  describe('showBreadcrumbs', () => {
    it('should be true when isFirstLevel and not selecting foreign key', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)
      item.setIsFirstLevel(true)

      expect(item.showBreadcrumbs).toBe(true)
    })

    it('should be false when not isFirstLevel', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, false)
      item.setIsFirstLevel(false)

      expect(item.showBreadcrumbs).toBe(false)
    })

    it('should be false when selecting foreign key even if isFirstLevel', () => {
      const deps = createMockBaseDeps()
      const item = new RowListItem(deps, true)
      item.setIsFirstLevel(true)

      expect(item.showBreadcrumbs).toBe(false)
    })
  })
})
