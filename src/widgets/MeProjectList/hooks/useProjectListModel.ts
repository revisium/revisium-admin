import { useEffect, useState } from 'react'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { MeProjectListModel } from 'src/widgets/MeProjectList/model/MeProjectListModel.ts'

export const useProjectListModel = () => {
  const [store] = useState(() => {
    return new MeProjectListModel(rootStore)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
