export const ROOT_ROUTE = '/'
export const SANDBOX_ROUTE = 'sandbox'
export const LOGIN_ROUTE = 'login'
export const LOGOUT_ROUTE = 'logout'
export const SIGN_UP_ROUTE = 'signup'
export const USERNAME_ROUTE = 'username'
export const LOGIN_GITHUB_ROUTE = 'github'
export const LOGIN_GOOGLE_ROUTE = 'google'
export const SIGN_UP_COMPLETED_ROUTE = 'completed'
export const SIGN_UP_CONFIRM_ROUTE = 'confirm'
export const APP_ROUTE = 'app'
export const ORGANIZATION_ROUTE = ':organizationId'

export const PROJECT_ROUTE = ':projectName'
export const PROJECT_SETTINGS_ROUTE = '-/settings'
export const PROJECT_USERS_ROUTE = '-/users'
export const PROJECT_API_KEYS_ROUTE = '-/api-keys'

export const BRANCH_ROUTE = ':branchName'
export const CHANGES_ROUTE = '-/changes'
export const ASSETS_ROUTE = '-/assets'
export const MIGRATIONS_ROUTE = '-/migrations'
export const REVISION_ROUTE = ':revisionIdOrTag'
export const TABLE_ROUTE = ':tableId'
export const ROW_ROUTE = ':rowId'

export enum RouteIds {
  Organization = 'organization',
  Project = 'project',
  Branch = 'branch',
  Revision = 'revision',

  Table = 'table',
  Row = 'row',
  Migrations = 'migrations',

  ProjectSettings = 'projectSettings',
  ProjectUsers = 'projectUsers',
  ProjectApiKeys = 'projectApiKeys',
}
