import { LoaderFunction } from 'react-router-dom'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const mainPageLoader: LoaderFunction = async () => {
  if (!rootStore.cache.meProjectsConnection.countLoaded) {
    await rootStore.backend.queryMeProjects({
      first: 100,
    })
  }

  return true
}
