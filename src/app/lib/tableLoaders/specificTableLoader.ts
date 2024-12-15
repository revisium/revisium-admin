import { LoaderFunction } from 'react-router-dom'
import { baseTableLoader } from 'src/app/lib/tableLoaders/baseTableLoader.ts'
import { waitForSpecificRevision } from 'src/app/lib/utils.ts'

export const specificTableLoader: LoaderFunction = async ({ params }) => {
  const revision = await waitForSpecificRevision(params)

  return baseTableLoader(params, revision.id)
}
