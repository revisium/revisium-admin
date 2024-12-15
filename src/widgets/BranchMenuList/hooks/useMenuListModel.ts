import { useEffect, useState } from 'react'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { MenuListModel } from 'src/widgets/BranchMenuList/model/MenuListModel.ts'

export const useMenuListModel = () => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new MenuListModel(projectPageModel)
  })

  useEffect(() => {
    store.init()

    return () => {
      store.dispose()
    }
  }, [store])

  return store
}
