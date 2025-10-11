export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: string; output: string }
  JSON: {
    input: { [key: string]: any } | string | number | boolean | null
    output: { [key: string]: any } | string | number | boolean | null
  }
}

export type AddUserToOrganizationInput = {
  organizationId: Scalars['String']['input']
  roleId: UserOrganizationRoles
  userId: Scalars['String']['input']
}

export type AddUserToProjectInput = {
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  roleId: UserProjectRoles
  userId: Scalars['String']['input']
}

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>
  not?: InputMaybe<Scalars['Boolean']['input']>
}

export type BranchModel = {
  __typename: 'BranchModel'
  createdAt: Scalars['DateTime']['output']
  draft: RevisionModel
  head: RevisionModel
  id: Scalars['String']['output']
  isRoot: Scalars['Boolean']['output']
  name: Scalars['String']['output']
  parent?: Maybe<ParentBranchModel>
  project: ProjectModel
  projectId: Scalars['String']['output']
  revisions: RevisionConnection
  start: RevisionModel
  touched: Scalars['Boolean']['output']
}

export type BranchModelRevisionsArgs = {
  data: GetBranchRevisionsInput
}

export type BranchModelEdge = {
  __typename: 'BranchModelEdge'
  cursor: Scalars['String']['output']
  node: BranchModel
}

export type BranchesConnection = {
  __typename: 'BranchesConnection'
  edges: Array<BranchModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type ChildBranchModel = {
  __typename: 'ChildBranchModel'
  branch: BranchModel
  revision: RevisionModel
}

export type ConfigurationModel = {
  __typename: 'ConfigurationModel'
  availableEmailSignUp: Scalars['Boolean']['output']
  github: GithubOauth
  google: GoogleOauth
  plugins: PluginsModel
}

export type ConfirmEmailCodeInput = {
  code: Scalars['String']['input']
}

export type CreateBranchByRevisionIdInput = {
  branchName: Scalars['String']['input']
  revisionId: Scalars['String']['input']
}

export type CreateEndpointInput = {
  revisionId: Scalars['String']['input']
  type: EndpointType
}

export type CreateProjectInput = {
  branchName?: InputMaybe<Scalars['String']['input']>
  fromRevisionId?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type CreateRevisionInput = {
  branchName: Scalars['String']['input']
  comment?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type CreateRowInput = {
  data: Scalars['JSON']['input']
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type CreateRowResultModel = {
  __typename: 'CreateRowResultModel'
  previousVersionTableId: Scalars['String']['output']
  row: RowModel
  table: TableModel
}

export type CreateTableInput = {
  revisionId: Scalars['String']['input']
  schema: Scalars['JSON']['input']
  tableId: Scalars['String']['input']
}

export type CreateTableResultModel = {
  __typename: 'CreateTableResultModel'
  branch: BranchModel
  table: TableModel
}

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>
  password: Scalars['String']['input']
  roleId: UserSystemRole
  username: Scalars['String']['input']
}

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['String']['input']>
  gt?: InputMaybe<Scalars['String']['input']>
  gte?: InputMaybe<Scalars['String']['input']>
  in?: InputMaybe<Array<Scalars['String']['input']>>
  lt?: InputMaybe<Scalars['String']['input']>
  lte?: InputMaybe<Scalars['String']['input']>
  notIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export type DeleteEndpointInput = {
  endpointId: Scalars['String']['input']
}

export type DeleteProjectInput = {
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type EndpointModel = {
  __typename: 'EndpointModel'
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  revision: RevisionModel
  type: EndpointType
}

export enum EndpointType {
  GRAPHQL = 'GRAPHQL',
  REST_API = 'REST_API',
}

export type GetBranchInput = {
  branchName: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type GetBranchRevisionsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  comment?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetBranchesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type GetMeProjectsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetProjectBranchesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetProjectInput = {
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type GetProjectsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  organizationId: Scalars['String']['input']
}

export type GetRevisionInput = {
  revisionId: Scalars['String']['input']
}

export type GetRevisionTablesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetRowCountForeignKeysByInput = {
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type GetRowForeignKeysInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  foreignKeyTableId: Scalars['String']['input']
}

export type GetRowInput = {
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type GetRowsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  orderBy?: InputMaybe<Array<OrderBy>>
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
  where?: InputMaybe<WhereInput>
}

export type GetTableForeignKeysInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetTableInput = {
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type GetTableRowsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetTablesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  revisionId: Scalars['String']['input']
}

export type GetUsersOrganizationInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  organizationId: Scalars['String']['input']
}

export type GetUsersProjectInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type GithubOauth = {
  __typename: 'GithubOauth'
  available: Scalars['Boolean']['output']
  clientId?: Maybe<Scalars['String']['output']>
}

export type GoogleOauth = {
  __typename: 'GoogleOauth'
  available: Scalars['Boolean']['output']
  clientId?: Maybe<Scalars['String']['output']>
}

export type JsonFilter = {
  array_contains?: InputMaybe<Array<Scalars['JSON']['input']>>
  array_ends_with?: InputMaybe<Scalars['JSON']['input']>
  array_starts_with?: InputMaybe<Scalars['JSON']['input']>
  equals?: InputMaybe<Scalars['JSON']['input']>
  gt?: InputMaybe<Scalars['Float']['input']>
  gte?: InputMaybe<Scalars['Float']['input']>
  lt?: InputMaybe<Scalars['Float']['input']>
  lte?: InputMaybe<Scalars['Float']['input']>
  mode?: InputMaybe<QueryMode>
  path?: InputMaybe<Array<Scalars['String']['input']>>
  search?: InputMaybe<Scalars['String']['input']>
  searchIn?: InputMaybe<SearchIn>
  searchLanguage?: InputMaybe<Scalars['String']['input']>
  searchType?: InputMaybe<SearchType>
  string_contains?: InputMaybe<Scalars['String']['input']>
  string_ends_with?: InputMaybe<Scalars['String']['input']>
  string_starts_with?: InputMaybe<Scalars['String']['input']>
}

export type LoginGithubInput = {
  code: Scalars['String']['input']
}

export type LoginGoogleInput = {
  code: Scalars['String']['input']
  redirectUrl: Scalars['String']['input']
}

export type LoginInput = {
  emailOrUsername: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type LoginModel = {
  __typename: 'LoginModel'
  accessToken: Scalars['String']['output']
}

export type Mutation = {
  __typename: 'Mutation'
  addUserToOrganization: Scalars['Boolean']['output']
  addUserToProject: Scalars['Boolean']['output']
  confirmEmailCode: LoginModel
  createBranchByRevisionId: BranchModel
  createEndpoint: EndpointModel
  createProject: ProjectModel
  createRevision: RevisionModel
  createRow: CreateRowResultModel
  createTable: CreateTableResultModel
  createUser: Scalars['Boolean']['output']
  deleteEndpoint: Scalars['Boolean']['output']
  deleteProject: Scalars['Boolean']['output']
  login: LoginModel
  loginGithub: LoginModel
  loginGoogle: LoginModel
  patchRow: PatchRowResultModel
  removeRow: RemoveRowResultModel
  removeTable: RemoveTableResultModel
  removeUserFromOrganization: Scalars['Boolean']['output']
  removeUserFromProject: Scalars['Boolean']['output']
  renameRow: RenameRowResultModel
  renameTable: RenameTableResultModel
  revertChanges: BranchModel
  setUsername: Scalars['Boolean']['output']
  signUp: Scalars['Boolean']['output']
  updatePassword: Scalars['Boolean']['output']
  updateProject: Scalars['Boolean']['output']
  updateRow: UpdateRowResultModel
  updateTable: UpdateTableResultModel
}

export type MutationAddUserToOrganizationArgs = {
  data: AddUserToOrganizationInput
}

export type MutationAddUserToProjectArgs = {
  data: AddUserToProjectInput
}

export type MutationConfirmEmailCodeArgs = {
  data: ConfirmEmailCodeInput
}

export type MutationCreateBranchByRevisionIdArgs = {
  data: CreateBranchByRevisionIdInput
}

export type MutationCreateEndpointArgs = {
  data: CreateEndpointInput
}

export type MutationCreateProjectArgs = {
  data: CreateProjectInput
}

export type MutationCreateRevisionArgs = {
  data: CreateRevisionInput
}

export type MutationCreateRowArgs = {
  data: CreateRowInput
}

export type MutationCreateTableArgs = {
  data: CreateTableInput
}

export type MutationCreateUserArgs = {
  data: CreateUserInput
}

export type MutationDeleteEndpointArgs = {
  data: DeleteEndpointInput
}

export type MutationDeleteProjectArgs = {
  data: DeleteProjectInput
}

export type MutationLoginArgs = {
  data: LoginInput
}

export type MutationLoginGithubArgs = {
  data: LoginGithubInput
}

export type MutationLoginGoogleArgs = {
  data: LoginGoogleInput
}

export type MutationPatchRowArgs = {
  data: PatchRowInput
}

export type MutationRemoveRowArgs = {
  data: RemoveRowInput
}

export type MutationRemoveTableArgs = {
  data: RemoveTableInput
}

export type MutationRemoveUserFromOrganizationArgs = {
  data: RemoveUserFromOrganizationInput
}

export type MutationRemoveUserFromProjectArgs = {
  data: RemoveUserFromProjectInput
}

export type MutationRenameRowArgs = {
  data: RenameRowInput
}

export type MutationRenameTableArgs = {
  data: RenameTableInput
}

export type MutationRevertChangesArgs = {
  data: RevertChangesInput
}

export type MutationSetUsernameArgs = {
  data: SetUsernameInput
}

export type MutationSignUpArgs = {
  data: SignUpInput
}

export type MutationUpdatePasswordArgs = {
  data: UpdatePasswordInput
}

export type MutationUpdateProjectArgs = {
  data: UpdateProjectInput
}

export type MutationUpdateRowArgs = {
  data: UpdateRowInput
}

export type MutationUpdateTableArgs = {
  data: UpdateTableInput
}

export type OrderBy = {
  aggregation?: InputMaybe<OrderDataAggregation>
  direction: SortOrder
  field: OrderByField
  path?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<OrderDataType>
}

export enum OrderByField {
  CREATEDAT = 'createdAt',
  DATA = 'data',
  ID = 'id',
  UPDATEDAT = 'updatedAt',
}

export enum OrderDataAggregation {
  AVG = 'avg',
  FIRST = 'first',
  LAST = 'last',
  MAX = 'max',
  MIN = 'min',
}

export enum OrderDataType {
  BOOLEAN = 'boolean',
  FLOAT = 'float',
  INT = 'int',
  TEXT = 'text',
  TIMESTAMP = 'timestamp',
}

export type PageInfo = {
  __typename: 'PageInfo'
  endCursor?: Maybe<Scalars['String']['output']>
  hasNextPage: Scalars['Boolean']['output']
  hasPreviousPage: Scalars['Boolean']['output']
  startCursor?: Maybe<Scalars['String']['output']>
}

export type ParentBranchModel = {
  __typename: 'ParentBranchModel'
  branch: BranchModel
  revision: RevisionModel
}

export type PatchRow = {
  op: PatchRowOp
  path: Scalars['String']['input']
  value: Scalars['JSON']['input']
}

export type PatchRowInput = {
  patches: Array<PatchRow>
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export enum PatchRowOp {
  REPLACE = 'replace',
}

export type PatchRowResultModel = {
  __typename: 'PatchRowResultModel'
  previousVersionRowId: Scalars['String']['output']
  previousVersionTableId: Scalars['String']['output']
  row: RowModel
  table: TableModel
}

export type PluginsModel = {
  __typename: 'PluginsModel'
  file: Scalars['Boolean']['output']
}

export type ProjectModel = {
  __typename: 'ProjectModel'
  allBranches: BranchesConnection
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  isPublic: Scalars['Boolean']['output']
  name: Scalars['String']['output']
  organizationId: Scalars['String']['output']
  rootBranch: BranchModel
}

export type ProjectModelAllBranchesArgs = {
  data: GetProjectBranchesInput
}

export type ProjectModelEdge = {
  __typename: 'ProjectModelEdge'
  cursor: Scalars['String']['output']
  node: ProjectModel
}

export type ProjectsConnection = {
  __typename: 'ProjectsConnection'
  edges: Array<ProjectModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Query = {
  __typename: 'Query'
  branch: BranchModel
  branches: BranchesConnection
  configuration: ConfigurationModel
  /** @deprecated use RowModel.rowForeignKeysBy.totalCount */
  getRowCountForeignKeysTo: Scalars['Int']['output']
  me: UserModel
  meProjects: ProjectsConnection
  project: ProjectModel
  projects: ProjectsConnection
  revision: RevisionModel
  row?: Maybe<RowModel>
  rows: RowsConnection
  table?: Maybe<TableModel>
  tables: TablesConnection
  usersOrganization: UsersOrganizationConnection
  usersProject: UsersProjectConnection
}

export type QueryBranchArgs = {
  data: GetBranchInput
}

export type QueryBranchesArgs = {
  data: GetBranchesInput
}

export type QueryGetRowCountForeignKeysToArgs = {
  data: GetRowCountForeignKeysByInput
}

export type QueryMeProjectsArgs = {
  data: GetMeProjectsInput
}

export type QueryProjectArgs = {
  data: GetProjectInput
}

export type QueryProjectsArgs = {
  data: GetProjectsInput
}

export type QueryRevisionArgs = {
  data: GetRevisionInput
}

export type QueryRowArgs = {
  data: GetRowInput
}

export type QueryRowsArgs = {
  data: GetRowsInput
}

export type QueryTableArgs = {
  data: GetTableInput
}

export type QueryTablesArgs = {
  data: GetTablesInput
}

export type QueryUsersOrganizationArgs = {
  data: GetUsersOrganizationInput
}

export type QueryUsersProjectArgs = {
  data: GetUsersProjectInput
}

export enum QueryMode {
  DEFAULT = 'default',
  INSENSITIVE = 'insensitive',
}

export type RemoveRowInput = {
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type RemoveRowResultModel = {
  __typename: 'RemoveRowResultModel'
  branch: BranchModel
  previousVersionTableId?: Maybe<Scalars['String']['output']>
  table?: Maybe<TableModel>
}

export type RemoveTableInput = {
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type RemoveTableResultModel = {
  __typename: 'RemoveTableResultModel'
  branch: BranchModel
}

export type RemoveUserFromOrganizationInput = {
  organizationId: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type RemoveUserFromProjectInput = {
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type RenameRowInput = {
  nextRowId: Scalars['String']['input']
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type RenameRowResultModel = {
  __typename: 'RenameRowResultModel'
  previousVersionRowId: Scalars['String']['output']
  previousVersionTableId: Scalars['String']['output']
  row: RowModel
  table: TableModel
}

export type RenameTableInput = {
  nextTableId: Scalars['String']['input']
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type RenameTableResultModel = {
  __typename: 'RenameTableResultModel'
  previousVersionTableId: Scalars['String']['output']
  table: TableModel
}

export type RevertChangesInput = {
  branchName: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type RevisionConnection = {
  __typename: 'RevisionConnection'
  edges: Array<RevisionModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type RevisionModel = {
  __typename: 'RevisionModel'
  branch: BranchModel
  child?: Maybe<RevisionModel>
  childBranches: Array<ChildBranchModel>
  children: Array<RevisionModel>
  comment: Scalars['String']['output']
  createdAt: Scalars['DateTime']['output']
  endpoints: Array<EndpointModel>
  id: Scalars['String']['output']
  isDraft: Scalars['Boolean']['output']
  isHead: Scalars['Boolean']['output']
  isStart: Scalars['Boolean']['output']
  parent?: Maybe<RevisionModel>
  sequence: Scalars['Int']['output']
  tables: TablesConnection
}

export type RevisionModelTablesArgs = {
  data: GetRevisionTablesInput
}

export type RevisionModelEdge = {
  __typename: 'RevisionModelEdge'
  cursor: Scalars['String']['output']
  node: RevisionModel
}

export type RoleModel = {
  __typename: 'RoleModel'
  id: Scalars['String']['output']
  name: Scalars['String']['output']
}

export type RowModel = {
  __typename: 'RowModel'
  countForeignKeysTo: Scalars['Int']['output']
  createdAt: Scalars['DateTime']['output']
  createdId: Scalars['String']['output']
  data: Scalars['JSON']['output']
  id: Scalars['String']['output']
  publishedAt: Scalars['DateTime']['output']
  readonly: Scalars['Boolean']['output']
  rowForeignKeysBy: RowsConnection
  rowForeignKeysTo: RowsConnection
  updatedAt: Scalars['DateTime']['output']
  versionId: Scalars['String']['output']
}

export type RowModelRowForeignKeysByArgs = {
  data: GetRowForeignKeysInput
}

export type RowModelRowForeignKeysToArgs = {
  data: GetRowForeignKeysInput
}

export type RowModelEdge = {
  __typename: 'RowModelEdge'
  cursor: Scalars['String']['output']
  node: RowModel
}

export type RowsConnection = {
  __typename: 'RowsConnection'
  edges: Array<RowModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export enum SearchIn {
  ALL = 'all',
  BOOLEANS = 'booleans',
  KEYS = 'keys',
  NUMBERS = 'numbers',
  STRINGS = 'strings',
  VALUES = 'values',
}

export enum SearchType {
  PHRASE = 'phrase',
  PLAIN = 'plain',
}

export type SetUsernameInput = {
  username: Scalars['String']['input']
}

export type SignUpInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
  username: Scalars['String']['input']
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>
  endsWith?: InputMaybe<Scalars['String']['input']>
  gt?: InputMaybe<Scalars['String']['input']>
  gte?: InputMaybe<Scalars['String']['input']>
  lt?: InputMaybe<Scalars['String']['input']>
  lte?: InputMaybe<Scalars['String']['input']>
  mode?: InputMaybe<QueryMode>
  not?: InputMaybe<Scalars['String']['input']>
  notIn?: InputMaybe<Array<Scalars['String']['input']>>
  startsWith?: InputMaybe<Scalars['String']['input']>
}

export type TableModel = {
  __typename: 'TableModel'
  count: Scalars['Int']['output']
  countForeignKeysBy: Scalars['Int']['output']
  countForeignKeysTo: Scalars['Int']['output']
  createdAt: Scalars['DateTime']['output']
  createdId: Scalars['String']['output']
  foreignKeysBy: TablesConnection
  foreignKeysTo: TablesConnection
  id: Scalars['String']['output']
  readonly: Scalars['Boolean']['output']
  rows: RowsConnection
  schema: Scalars['JSON']['output']
  updatedAt: Scalars['DateTime']['output']
  versionId: Scalars['String']['output']
}

export type TableModelForeignKeysByArgs = {
  data: GetTableForeignKeysInput
}

export type TableModelForeignKeysToArgs = {
  data: GetTableForeignKeysInput
}

export type TableModelRowsArgs = {
  data: GetTableRowsInput
}

export type TableModelEdge = {
  __typename: 'TableModelEdge'
  cursor: Scalars['String']['output']
  node: TableModel
}

export type TablesConnection = {
  __typename: 'TablesConnection'
  edges: Array<TableModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type UpdatePasswordInput = {
  newPassword: Scalars['String']['input']
  oldPassword: Scalars['String']['input']
}

export type UpdateProjectInput = {
  isPublic: Scalars['Boolean']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type UpdateRowInput = {
  data: Scalars['JSON']['input']
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type UpdateRowResultModel = {
  __typename: 'UpdateRowResultModel'
  previousVersionRowId: Scalars['String']['output']
  previousVersionTableId: Scalars['String']['output']
  row: RowModel
  table: TableModel
}

export type UpdateTableInput = {
  patches: Scalars['JSON']['input']
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type UpdateTableResultModel = {
  __typename: 'UpdateTableResultModel'
  previousVersionTableId: Scalars['String']['output']
  table: TableModel
}

export type UserModel = {
  __typename: 'UserModel'
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  organizationId?: Maybe<Scalars['String']['output']>
  username?: Maybe<Scalars['String']['output']>
}

export enum UserOrganizationRoles {
  DEVELOPER = 'developer',
  EDITOR = 'editor',
  ORGANIZATIONADMIN = 'organizationAdmin',
  ORGANIZATIONOWNER = 'organizationOwner',
  READER = 'reader',
}

export enum UserProjectRoles {
  DEVELOPER = 'developer',
  EDITOR = 'editor',
  READER = 'reader',
}

export enum UserSystemRole {
  SYSTEMADMIN = 'systemAdmin',
  SYSTEMFULLAPIREAD = 'systemFullApiRead',
  SYSTEMUSER = 'systemUser',
}

export type UsersOrganizationConnection = {
  __typename: 'UsersOrganizationConnection'
  edges: Array<UsersOrganizationModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type UsersOrganizationModel = {
  __typename: 'UsersOrganizationModel'
  id: Scalars['String']['output']
  role: RoleModel
  user: UserModel
}

export type UsersOrganizationModelEdge = {
  __typename: 'UsersOrganizationModelEdge'
  cursor: Scalars['String']['output']
  node: UsersOrganizationModel
}

export type UsersProjectConnection = {
  __typename: 'UsersProjectConnection'
  edges: Array<UsersProjectModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type UsersProjectModel = {
  __typename: 'UsersProjectModel'
  id: Scalars['String']['output']
  role: RoleModel
  user: UserModel
}

export type UsersProjectModelEdge = {
  __typename: 'UsersProjectModelEdge'
  cursor: Scalars['String']['output']
  node: UsersProjectModel
}

export type WhereInput = {
  AND?: InputMaybe<Array<WhereInput>>
  NOT?: InputMaybe<Array<WhereInput>>
  OR?: InputMaybe<Array<WhereInput>>
  createdAt?: InputMaybe<DateTimeFilter>
  createdId?: InputMaybe<StringFilter>
  data?: InputMaybe<JsonFilter>
  id?: InputMaybe<StringFilter>
  publishedAt?: InputMaybe<DateTimeFilter>
  readonly?: InputMaybe<BooleanFilter>
  updatedAt?: InputMaybe<DateTimeFilter>
  versionId?: InputMaybe<StringFilter>
}
