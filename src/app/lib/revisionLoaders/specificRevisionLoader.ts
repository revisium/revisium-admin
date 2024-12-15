import { LoaderFunction } from 'react-router-dom'
import { getBranchVariables, getSpecificRevisionVariables } from 'src/app/lib/utils.ts'
import { COUNT_REVISIONS_TO_BE_LOADED } from 'src/shared/config/countRevisionsToBeLoaded.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const specificRevisionLoader: LoaderFunction = async ({ params }) => {
  const revisionVariables = getSpecificRevisionVariables(params)
  const branchVariables = getBranchVariables(params)

  const revision =
    rootStore.cache.getRevision(revisionVariables.revisionId) ||
    (await rootStore.backend.queryRevision(revisionVariables))

  const childrenDetails = revision.getChildrenDetails(COUNT_REVISIONS_TO_BE_LOADED)
  if (!childrenDetails.isAllLoaded) {
    await rootStore.queryRevisions({
      branch: branchVariables,
      revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, after: revision.id },
    })
  }

  const parentDetails = revision.getParentsDetails(COUNT_REVISIONS_TO_BE_LOADED)
  if (!parentDetails.isAllLoaded) {
    await rootStore.queryRevisions({
      branch: branchVariables,
      revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, before: revision.id },
    })
  }

  if (revision.tablesConnection.countLoaded === 0) {
    await rootStore.queryTables({
      revisionId: revision.id,
      first: 50,
    })
  }

  return revision
}
