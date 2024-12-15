import { useEffect, useState } from 'react'
import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { BranchEndpointsCardItemModel } from 'src/features/BranchEndpointsCard/model/BranchEndpointsCardItemModel.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

export const useBranchEndpointsCardItemModel = (endpointType: EndpointType) => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new BranchEndpointsCardItemModel(projectPageModel, endpointType)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
