import { LoaderFunction } from 'react-router-dom'
import { baseTableLoader } from 'src/app/lib/tableLoaders/baseTableLoader.ts'
import { waitForBranch } from 'src/app/lib/utils.ts'

export const draftTableLoader: LoaderFunction = async ({ params }) => {
  const branch = await waitForBranch(params)

  return baseTableLoader(params, branch.draft.id)
}
