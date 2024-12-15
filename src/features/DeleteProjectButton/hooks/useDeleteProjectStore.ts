import { useEffect, useState } from 'react'
import { DeleteProjectModel } from 'src/features/DeleteProjectButton/model/DeleteProjectModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const useDeleteProjectStore = () => {
  const [store] = useState(() => {
    return new DeleteProjectModel(rootStore)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
