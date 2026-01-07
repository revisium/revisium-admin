import { TableUpdatingItem } from '../TableUpdatingItem.ts'
import { TableStackItemType } from '../../../config/types.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { createMockUpdatingDeps } from '../../__tests__/createMockDeps.ts'

describe('TableUpdatingItem', () => {
  describe('initialization', () => {
    it('should create with Updating type', () => {
      const deps = createMockUpdatingDeps()
      const store = new RootNodeStore()
      const item = new TableUpdatingItem(deps, false, store)

      expect(item.type).toBe(TableStackItemType.Updating)
    })

    it('should use provided store', () => {
      const deps = createMockUpdatingDeps()
      const store = new RootNodeStore()
      const item = new TableUpdatingItem(deps, false, store)

      expect(item.store).toBe(store)
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockUpdatingDeps()
      const store = new RootNodeStore()

      const item1 = new TableUpdatingItem(deps, false, store)
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new TableUpdatingItem(deps, true, store)
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockUpdatingDeps()
      const store = new RootNodeStore()
      const item1 = new TableUpdatingItem(deps, false, store)
      const item2 = new TableUpdatingItem(deps, false, store)

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('approve', () => {
    it('should call updateTable when there are schema changes', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateTable as jest.Mock).mockResolvedValue({ id: 'table-1' })

      const object = new ObjectNodeStore()
      object.setId('table-1')
      const store = new RootNodeStore(object, 'table-1')
      store.submitChanges()

      const field = new StringNodeStore()
      field.setId('newField')
      store.addProperty(object, field)

      const item = new TableUpdatingItem(deps, false, store)

      await item.approve()

      expect(deps.mutationDataSource.updateTable).toHaveBeenCalled()
    })

    it('should call renameTable when table id changed', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.renameTable as jest.Mock).mockResolvedValue({ id: 'table-2' })

      const object = new ObjectNodeStore()
      object.setId('table-1')
      const store = new RootNodeStore(object, 'table-1')
      store.submitChanges()
      object.setId('table-2')

      const item = new TableUpdatingItem(deps, false, store)

      await item.approve()

      expect(deps.mutationDataSource.renameTable).toHaveBeenCalled()
    })

    it('should not call any mutation when no changes', async () => {
      const deps = createMockUpdatingDeps()

      const object = new ObjectNodeStore()
      object.setId('table-1')
      const store = new RootNodeStore(object, 'table-1')
      store.submitChanges()

      const item = new TableUpdatingItem(deps, false, store)

      await item.approve()

      expect(deps.mutationDataSource.updateTable).not.toHaveBeenCalled()
      expect(deps.mutationDataSource.renameTable).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockUpdatingDeps()
      const store = new RootNodeStore()
      const item = new TableUpdatingItem(deps, false, store)

      item.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalled()
    })
  })
})
