import { useEffect, useState } from 'react'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ITableModel } from 'src/shared/model/BackendStore'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'

export const useRowListModel = (table: ITableModel) => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    const permissionContext = container.get(PermissionContext)
    return new RowListModel(rootStore, projectPageModel, table, permissionContext)
  })

  useEffect(() => {
    store.init()
    store.setTable(table)

    return () => store.dispose()
  }, [store, table])

  return store
}
