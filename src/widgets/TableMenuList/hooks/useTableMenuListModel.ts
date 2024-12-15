import { useEffect, useState } from 'react'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { TableMenuListModel } from 'src/widgets/TableMenuList/model/TableMenuListModel.ts'

export const useTableMenuListModel = () => {
  const projectPageModel = useProjectPageModel()
  const linkMaker = useLinkMaker()

  const [store] = useState(() => {
    return new TableMenuListModel(projectPageModel, linkMaker)
  })

  useEffect(() => {
    store.init()

    return () => {
      store.dispose()
    }
  }, [store])

  return store
}
