import { LoaderFunction } from 'react-router-dom'
import { waitForBranch } from 'src/app/lib/utils.ts'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { baseTableLoader } from './baseTableLoader.ts'

export const tableLoader: LoaderFunction = async ({ params }) => {
  const { revisionIdOrTag } = params

  if (!revisionIdOrTag) {
    throw new Error('Not found revisionIdOrTag in route params')
  }

  const branch = await waitForBranch(params)

  let revisionId: string

  if (revisionIdOrTag === HEAD_TAG) {
    revisionId = branch.head.id
  } else if (revisionIdOrTag === DRAFT_TAG) {
    revisionId = branch.draft.id
  } else {
    revisionId = revisionIdOrTag
  }

  return baseTableLoader(params, revisionId)
}
