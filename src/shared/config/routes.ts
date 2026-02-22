export const ROOT_ROUTE = '/'
export const SANDBOX_ROUTE = 'sandbox'
export const LOGIN_ROUTE = 'login'
export const LOGOUT_ROUTE = 'logout'
export const SIGN_UP_ROUTE = 'signup'
export const USERNAME_ROUTE = 'username'
export const LOGIN_GITHUB_ROUTE = 'github'
export const LOGIN_GOOGLE_ROUTE = 'google'
export const AUTHORIZE_ROUTE = 'authorize'
export const GET_TOKEN_ROUTE = 'get-token'
export const GET_MCP_TOKEN_ROUTE = 'get-mcp-token'
export const SIGN_UP_COMPLETED_ROUTE = 'completed'
export const SIGN_UP_CONFIRM_ROUTE = 'confirm'
export const APP_ROUTE = 'app'
export const ORGANIZATION_ROUTE = ':organizationId'

export const PROJECT_ROUTE = ':projectName'
export const PROJECT_SETTINGS_ROUTE = '-/settings'
export const PROJECT_USERS_ROUTE = '-/users'
export const PROJECT_API_KEYS_ROUTE = '-/api-keys'
export const PROJECT_MCP_ROUTE = '-/mcp'

export const BRANCH_ROUTE = ':branchName'
export const CHANGES_ROUTE = '-/changes'
export const ASSETS_ROUTE = '-/assets'
export const MIGRATIONS_ROUTE = '-/migrations'
export const ENDPOINTS_ROUTE = '-/endpoints'
export const BRANCHES_ROUTE = '-/branches'
export const RELATIONS_ROUTE = '-/relations'
export const BRANCH_MAP_ROUTE = '-/branch-map'
export const REVISION_ROUTE = ':revisionIdOrTag'
export const TABLE_ROUTE = ':tableId'
export const ROW_ROUTE = ':rowId'

export const DRAFT_TAG = 'draft'
export const HEAD_TAG = 'head'

export const ADMIN_ROUTE = 'admin'
export const ADMIN_USERS_ROUTE = 'users'
export const ADMIN_USER_DETAIL_ROUTE = ':userId'
export const ADMIN_ORGANIZATIONS_ROUTE = 'organizations'

export enum RouteIds {
  Organization = 'organization',
  Project = 'project',
  Branch = 'branch',
  Revision = 'revision',

  Table = 'table',
  Row = 'row',
  Changes = 'changes',
  Assets = 'assets',
  Migrations = 'migrations',
  Endpoints = 'endpoints',
  Branches = 'branches',
  Relations = 'relations',
  BranchMap = 'branchMap',

  ProjectSettings = 'projectSettings',
  ProjectUsers = 'projectUsers',
  ProjectApiKeys = 'projectApiKeys',
  ProjectMcp = 'projectMcp',

  Admin = 'admin',
  AdminUsers = 'adminUsers',
  AdminUserDetail = 'adminUserDetail',
  AdminOrganizations = 'adminOrganizations',
}
