export enum PermissionAction {
  create = 'create',
  delete = 'delete',
  read = 'read',
  revert = 'revert',
  update = 'update',
  add = 'add',
}

export enum PermissionSubject {
  Organization = 'Organization',
  Project = 'Project',
  Branch = 'Branch',
  Revision = 'Revision',
  Table = 'Table',
  Row = 'Row',
  Endpoint = 'Endpoint',
  User = 'User',
}

export type Actions = `${PermissionAction}`

export type Subjects = `${PermissionSubject}`

export type PermissionCondition = Record<string, unknown> | null

export interface PermissionRule {
  id: string
  action: string
  subject: string
  condition?: PermissionCondition
}

export interface RoleData {
  id: string
  name: string
  permissions: PermissionRule[]
}

export interface UserProjectData {
  id: string
  role: RoleData
}

export interface UserOrganizationData {
  id: string
  role: RoleData
}

export type PermissionScope =
  | { type: 'system' }
  | { type: 'organization'; organizationId: string }
  | { type: 'project'; projectId: string }
