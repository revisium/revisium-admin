import { IProjectModelReferences } from 'src/shared/model/BackendStore'
import { ProjectMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/project.generated.ts'

export const transformProjectFragment = (fragment: ProjectMstFragment): Partial<IProjectModelReferences> => ({
  id: fragment.id,
  organization: fragment.organizationId,
  name: fragment.name,
  createdAt: fragment.createdAt,
  isPublic: fragment.isPublic,
  rootBranch: fragment.rootBranch.id,
})
