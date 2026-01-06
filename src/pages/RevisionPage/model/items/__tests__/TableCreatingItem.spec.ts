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

    it('should create with new RootNodeStore by default', () => {
      const deps = createMockCreatingDeps()
      const item = new TableCreatingItem(deps, false)

      expect(item.store).toBeDefined()
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

  describe('approve', () => {
    it('should call createTable command on success', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createTable as jest.Mock).mockResolvedValue({ id: 'new-table' })

      const item = new TableCreatingItem(deps, false)
      item.store.node.setId('new-table')

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(deps.mutationDataSource.createTable).toHaveBeenCalled()
      expect(resolver).toHaveBeenCalledWith({ type: 'creatingToUpdating' })
    })

    it('should call selectTable when isSelectingForeignKey', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createTable as jest.Mock).mockResolvedValue({ id: 'new-table' })

      const item = new TableCreatingItem(deps, true)
      item.store.node.setId('new-table')

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(resolver).toHaveBeenCalledWith({ type: 'selectTable', tableId: 'new-table' })
    })

    it('should not resolve on failure', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createTable as jest.Mock).mockResolvedValue(null)

      const item = new TableCreatingItem(deps, false)
      item.store.node.setId('new-table')

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(resolver).not.toHaveBeenCalled()
    })
  })
})
