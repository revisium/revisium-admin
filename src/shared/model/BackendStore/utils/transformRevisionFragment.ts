import { IRevisionModelReferences } from 'src/shared/model/BackendStore'
import { RevisionMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/revision.generated.ts'

export const transformRevisionFragment = (fragment: RevisionMstFragment): Partial<IRevisionModelReferences> => ({
  id: fragment.id,
  createdAt: fragment.createdAt,
  comment: fragment.comment,
  parent: fragment.parent?.id,
  isThereParent: Boolean(fragment.parent?.id),
  child: fragment.child?.id,
  isThereChild: Boolean(fragment.child?.id),
  childBranches: fragment.childBranches.map((childBranch) => ({
    branchName: childBranch.branch.name,
    revisionStartId: childBranch.revision.id,
  })),
  endpoints: fragment.endpoints.map((endpoint) => endpoint.id),
})
