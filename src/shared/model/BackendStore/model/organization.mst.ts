import { types } from 'mobx-state-tree'
import { IProjectModel, ProjectModel } from 'src/shared/model/BackendStore'
import {
  createModelConnection,
  IConnection,
} from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

export const OrganizationProjectsConnection = createModelConnection(
  'OrganizationProjectsConnection',
  types.late(() => ProjectModel),
)

export const OrganizationModel = types.model('OrganizationModel', {
  id: types.identifier,
  projectsConnection: types.optional(OrganizationProjectsConnection, {}),
})

export type IOrganizationModelBase = Readonly<{ id: string }>

export type IOrganizationModel = IOrganizationModelBase &
  Readonly<{
    projectsConnection: IConnection<IProjectModel>
  }>

export type IOrganizationModelReferences = IOrganizationModelBase &
  Readonly<{
    projectsConnection: IConnection<string>
  }>
