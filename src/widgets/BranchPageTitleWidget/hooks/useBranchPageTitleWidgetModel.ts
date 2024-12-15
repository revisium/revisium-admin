import { useEffect, useState } from 'react'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { BranchPageTitleWidgetModel } from 'src/widgets/BranchPageTitleWidget/model/BranchPageTitleWidgetModel.ts'

export const useBranchPageTitleWidgetModel = () => {
  const projectPageModel = useProjectPageModel()
  const linkMaker = useLinkMaker()

  const [store] = useState(() => {
    return new BranchPageTitleWidgetModel(projectPageModel, linkMaker)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
