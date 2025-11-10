import { LoaderFunction } from 'react-router-dom'
import { waitForBranch } from 'src/app/lib/utils.ts'
import { baseRowLoader } from './baseRowLoader.ts'

export const rowLoader: LoaderFunction = async ({ params }) => {
  const { revisionIdOrTag } = params

  if (!revisionIdOrTag) {
    throw new Error('Not found revisionIdOrTag in route params')
  }

  const branch = await waitForBranch(params)

  let revisionId

  if (revisionIdOrTag === 'head') {
    revisionId = branch.head.id
  } else if (revisionIdOrTag === 'draft') {
    revisionId = branch.draft.id
  } else {
    revisionId = revisionIdOrTag
  }

  return baseRowLoader(params, revisionId)
}