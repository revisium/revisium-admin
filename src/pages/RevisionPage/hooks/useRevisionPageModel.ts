import { useEffect, useState } from 'react'
import { RevisionPageModel } from 'src/pages/RevisionPage/model/RevisionPageModel.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const useRevisionPageModel = () => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new RevisionPageModel(rootStore, projectPageModel)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
