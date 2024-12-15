import { useEffect, useState } from 'react'
import { BranchEndpointsCardModel } from 'src/features/BranchEndpointsCard/model/BranchEndpointsCardModel.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

export const useBranchEndpointsCardModel = () => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new BranchEndpointsCardModel(projectPageModel)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
