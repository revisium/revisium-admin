import { LoaderFunction } from 'react-router-dom'
import { baseTableLoader } from 'src/app/lib/tableLoaders/baseTableLoader.ts'
import { waitForBranch } from 'src/app/lib/utils.ts'

export const headTableLoader: LoaderFunction = async ({ params }) => {
  const branch = await waitForBranch(params)

  return baseTableLoader(params, branch.head.id)
}
