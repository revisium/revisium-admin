import { LoaderFunction } from 'react-router-dom'
import { getBranchVariables, waitForBranch } from 'src/app/lib/utils.ts'
import { COUNT_REVISIONS_TO_BE_LOADED } from 'src/shared/config/countRevisionsToBeLoaded.ts'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const revisionLoader: LoaderFunction = async ({ params }) => {
  const { revisionIdOrTag } = params
  const branchVariables = getBranchVariables(params)

  if (!revisionIdOrTag) {
    throw new Error('Not found revisionIdOrTag in route params')
  }

  const branch = await waitForBranch(params)

  let revision: IRevisionModel

  if (revisionIdOrTag === HEAD_TAG) {
    revision = branch.head
  } else if (revisionIdOrTag === DRAFT_TAG) {
    revision = branch.draft
  } else {
    revision =
      rootStore.cache.getRevision(revisionIdOrTag) ||
      (await rootStore.backend.queryRevision({ revisionId: revisionIdOrTag }))
  }

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
