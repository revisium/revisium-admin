import { LoaderFunction } from 'react-router-dom'
import { getBranchVariables, waitForBranch } from 'src/app/lib/utils.ts'
import { COUNT_REVISIONS_TO_BE_LOADED } from 'src/shared/config/countRevisionsToBeLoaded.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const revisionLoader: LoaderFunction = async ({ params }) => {
  const { revisionIdOrTag } = params
  const branchVariables = getBranchVariables(params)

  if (!revisionIdOrTag) {
    throw new Error('Not found revisionIdOrTag in route params')
  }

  const branch = await waitForBranch(params)

  let revision

  if (revisionIdOrTag === 'head') {
    revision = branch.head
  } else if (revisionIdOrTag === 'draft') {
    revision = branch.draft
  } else {
    // Specific revision ID
    revision =
      rootStore.cache.getRevision(revisionIdOrTag) ||
      (await rootStore.backend.queryRevision({ revisionId: revisionIdOrTag }))
  }

  // Load children revisions for navigation
  const childrenDetails = revision.getChildrenDetails(COUNT_REVISIONS_TO_BE_LOADED)
  if (!childrenDetails.isAllLoaded) {
    await rootStore.queryRevisions({
      branch: branchVariables,
      revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, after: revision.id },
    })
  }

  // Load parent revisions for navigation
  const parentDetails = revision.getParentsDetails(COUNT_REVISIONS_TO_BE_LOADED)
  if (!parentDetails.isAllLoaded) {
    await rootStore.queryRevisions({
      branch: branchVariables,
      revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, before: revision.id },
    })
  }

  // Load tables if not already loaded
  if (revision.tablesConnection.countLoaded === 0) {
    await rootStore.queryTables({
      revisionId: revision.id,
      first: 50,
    })
  }

  return revision
}