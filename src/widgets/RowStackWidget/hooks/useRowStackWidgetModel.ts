import { useEffect, useState } from 'react'
import { RowStackWidgetModel } from 'src/widgets/RowStackWidget/model/RowStackWidgetModel.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const useRowStackWidgetModel = (startWithUpdating?: boolean) => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new RowStackWidgetModel(rootStore, projectPageModel, startWithUpdating)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
