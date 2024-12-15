import { useEffect, useState } from 'react'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { BranchActionsWidgetModel } from 'src/widgets/BranchActionsWidget/model/BranchActionsWidgetModel.ts'

export const useBranchActionsWidgetModel = () => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new BranchActionsWidgetModel(rootStore, projectPageModel)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
