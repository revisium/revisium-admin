import { useEffect, useState } from 'react'
import { CreateProjectModel } from 'src/features/CreateProjectCard/model/CreateProjectModel.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const useCreateProjectStore = () => {
  const [store] = useState(() => {
    const authService = container.get(AuthService)

    return new CreateProjectModel(rootStore, authService)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
