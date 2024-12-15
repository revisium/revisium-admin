import { IBranchModelReferences, IParentBranch } from 'src/shared/model/BackendStore'
import { BranchMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/branch.generated.ts'

export const transformBranchFragment = (
  fragment: BranchMstFragment,
  parentBranch?: IParentBranch,
): Partial<IBranchModelReferences> => ({
  id: fragment.id,
  name: fragment.name,
  touched: fragment.touched,
  createdAt: fragment.createdAt,
  start: fragment.start.id,
  head: fragment.head.id,
  draft: fragment.draft.id,
  parentBranch,
})
