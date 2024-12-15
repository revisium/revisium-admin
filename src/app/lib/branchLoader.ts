import { LoaderFunction } from 'react-router-dom'
import { getBranchVariables } from 'src/app/lib/utils.ts'
import { COUNT_REVISIONS_TO_BE_LOADED } from 'src/shared/config/countRevisionsToBeLoaded.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const branchLoader: LoaderFunction = async ({ params }) => {
  const branchVariables = getBranchVariables(params)

  const branch =
    rootStore.cache.getBranchByVariables(branchVariables) || (await rootStore.backend.queryBranch(branchVariables))

  const childrenDetails = branch.start.getChildrenDetails(COUNT_REVISIONS_TO_BE_LOADED)
  if (!childrenDetails.isAllLoaded) {
    await rootStore.queryRevisions({
      branch: branchVariables,
      revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, after: branch.start.id },
    })
  }

  const parentDetails = branch.head.getParentsDetails(COUNT_REVISIONS_TO_BE_LOADED)
  if (!parentDetails.isAllLoaded) {
    await rootStore.queryRevisions({
      branch: branchVariables,
      revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, before: branch.head.id },
    })
  }

  return branch
}
