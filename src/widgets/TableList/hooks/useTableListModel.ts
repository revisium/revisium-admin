import { useEffect, useState } from 'react'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { TableListModel } from 'src/widgets/TableList/model/TableListModel.ts'

export const useTableListModel = () => {
  const projectListModel = useProjectPageModel()

  const [store] = useState(() => {
    return new TableListModel(rootStore, projectListModel)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
