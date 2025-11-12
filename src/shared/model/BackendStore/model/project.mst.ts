import { IAnyModelType, SnapshotOrInstance, types } from 'mobx-state-tree'
import { BranchModel, IBranchModel, ISODate } from 'src/shared/model/BackendStore'
import {
  createModelConnection,
  IConnection,
} from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'
import { IOrganizationModel, OrganizationModel } from 'src/shared/model/BackendStore/model/organization.mst.ts'

export const ProjectBranchesConnection = createModelConnection(
  'ProjectBranchesConnection',
  types.late(() => BranchModel),
)

export const ProjectModel = types
  .model('ProjectModel', {
    id: types.identifier,
    organization: types.reference(types.late((): IAnyModelType => OrganizationModel)),
    name: types.string,
    isPublic: types.boolean,
    createdAt: types.late(() => ISODate),
    rootBranch: types.reference(types.late(() => BranchModel)),
    branchesConnection: types.optional(ProjectBranchesConnection, {}),
  })
  .actions((self) => ({
    update(projectSnapshot: SnapshotOrInstance<typeof ProjectModel>) {
      for (const [key, value] of Object.entries(projectSnapshot)) {
        self[key] = value
      }
    },
  }))

export type IProjectModelBase = Readonly<{
  id: string
  name: string
  isPublic: boolean
  createdAt: Date | string
}>

export type IProjectModel = IProjectModelBase &
  Readonly<{
    organization: IOrganizationModel
    rootBranch: IBranchModel
    branchesConnection: IConnection<IBranchModel>
  }> & {
    update: (snapshot: Partial<Omit<IProjectModelBase, 'id'>>) => void
  }

export type IProjectModelReferences = IProjectModelBase &
  Readonly<{
    organization: string
    rootBranch: string
    branchesConnection: IConnection<string>
  }>
