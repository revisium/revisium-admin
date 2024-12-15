import { IBranchModel, IParentBranch } from 'src/shared/model/BackendStore'
import { BranchMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/branch.generated.ts'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { addRevisionFragmentToCache } from 'src/shared/model/BackendStore/utils/addRevisionFragmentToCache.ts'
import { transformBranchFragment } from 'src/shared/model/BackendStore/utils/transformBranchFragment.ts'

export const addBranchFragmentToCache = (cache: ICacheModel, branchFragment: BranchMstFragment): IBranchModel => {
  addRevisionFragmentToCache(cache, branchFragment.start)
  addRevisionFragmentToCache(cache, branchFragment.head)
  addRevisionFragmentToCache(cache, { ...branchFragment.draft, childBranches: [] })

  const parentFragment = branchFragment.parent
  const parentBranch: IParentBranch | undefined = parentFragment
    ? { branchName: parentFragment.branch.name, fromRevisionId: parentFragment.revision.id }
    : undefined

  const transformedBranchFragment = transformBranchFragment(branchFragment, parentBranch)

  return cache.addOrUpdateBranch(transformedBranchFragment)
}
