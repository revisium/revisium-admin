import { IProjectModel } from 'src/shared/model/BackendStore'
import { ProjectMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/project.generated.ts'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { addBranchFragmentToCache } from 'src/shared/model/BackendStore/utils/addBranchFragmentToCache.ts'
import { transformProjectFragment } from 'src/shared/model/BackendStore/utils/transformProjectFragment.ts'

export const addProjectFragmentToCache = (cache: ICacheModel, projectFragment: ProjectMstFragment): IProjectModel => {
  cache.addOrganization({ id: projectFragment.organizationId })
  addBranchFragmentToCache(cache, projectFragment.rootBranch)
  return cache.addProject(transformProjectFragment(projectFragment))
}
