import { LoaderFunction } from 'react-router-dom'
import { waitForBranch } from 'src/app/lib/utils.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { RevisionDataSource, RevisionLoaderData } from 'src/entities/Revision'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'

export const revisionLoader: LoaderFunction = async ({ params }) => {
  const { revisionIdOrTag } = params

  if (!revisionIdOrTag) {
    throw new Error('Not found revisionIdOrTag in route params')
  }

  const branch = await waitForBranch(params)
  const revisionDataSource = container.get(RevisionDataSource)
  const context = container.get(ProjectContext)

  let revision: RevisionLoaderData

  if (revisionIdOrTag === HEAD_TAG) {
    revision = branch.head
  } else if (revisionIdOrTag === DRAFT_TAG) {
    revision = branch.draft
  } else {
    revision = await revisionDataSource.getRevision(revisionIdOrTag)
  }

  context.setRevision(revision)

  return revision
}
