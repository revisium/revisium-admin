import { useEffect, useState } from 'react'
import { ITableModel } from 'src/shared/model/BackendStore'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'

export const useRowListModel = (table: ITableModel) => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new RowListModel(rootStore, projectPageModel, table)
  })

  useEffect(() => {
    store.init()
    store.setTable(table)

    return () => store.dispose()
  }, [store, table])

  return store
}
