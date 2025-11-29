import { useEffect, useState } from 'react'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { TableListModel } from 'src/widgets/TableList/model/TableListModel.ts'

export const useTableListModel = () => {
  const projectListModel = useProjectPageModel()

  const [store] = useState(() => {
    const permissionContext = container.get(PermissionContext)
    return new TableListModel(rootStore, projectListModel, permissionContext)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
