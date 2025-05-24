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
export const BRANCH_ROUTE = ':branchName'
export const DRAFT_REVISION_ROUTE = '-/draft'
export const SPECIFIC_REVISION_ROUTE = '-/:revisionId'
export const TABLE_ROUTE = ':tableId'
export const ROW_ROUTE = ':rowId'

export enum RouteIds {
  Organization = 'organization',
  Project = 'project',
  Branch = 'branch',
  DraftRevision = 'draftRevision',
  HeadRevision = 'headRevision',
  SpecificRevision = 'specificRevision',
  DraftTable = 'draftTable',
  HeadTable = 'headTable',
  SpecificTable = 'specificTable',
  DraftRow = 'draftRow',
  HeadRow = 'headRow',
  SpecificRow = 'specificRow',
}
