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

export type AddedRowChangeModel = {
  __typename: 'AddedRowChangeModel'
  changeType: ChangeType
  fieldChanges: Array<FieldChangeModel>
  row: RowChangeRowModel
  table: RowChangeTableModel
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

export enum ChangeType {
  ADDED = 'ADDED',
  MODIFIED = 'MODIFIED',
  REMOVED = 'REMOVED',
  RENAMED = 'RENAMED',
  RENAMED_AND_MODIFIED = 'RENAMED_AND_MODIFIED',
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

export type CreateRowsInput = {
  isRestore?: InputMaybe<Scalars['Boolean']['input']>
  revisionId: Scalars['String']['input']
  rows: Array<CreateRowsRowInput>
  tableId: Scalars['String']['input']
}

export type CreateRowsResultModel = {
  __typename: 'CreateRowsResultModel'
  previousVersionTableId: Scalars['String']['output']
  rows: Array<RowModel>
  table: TableModel
}

export type CreateRowsRowInput = {
  data: Scalars['JSON']['input']
  rowId: Scalars['String']['input']
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
  revisionId: Scalars['String']['output']
  type: EndpointType
}

export type EndpointModelEdge = {
  __typename: 'EndpointModelEdge'
  cursor: Scalars['String']['output']
  node: EndpointModel
}

export enum EndpointType {
  GRAPHQL = 'GRAPHQL',
  REST_API = 'REST_API',
}

export type EndpointsConnection = {
  __typename: 'EndpointsConnection'
  edges: Array<EndpointModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type FieldChangeModel = {
  __typename: 'FieldChangeModel'
  changeType: RowChangeDetailType
  fieldPath: Scalars['String']['output']
  movedFrom?: Maybe<Scalars['String']['output']>
  newValue?: Maybe<Scalars['JSON']['output']>
  oldValue?: Maybe<Scalars['JSON']['output']>
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
  inclusive?: InputMaybe<Scalars['Boolean']['input']>
  /** Sort order: asc (default) or desc */
  sort?: InputMaybe<SortOrder>
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

export type GetProjectEndpointsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  branchId?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  type?: InputMaybe<EndpointType>
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

export type GetRevisionChangesInput = {
  compareWithRevisionId?: InputMaybe<Scalars['String']['input']>
  includeSystem?: InputMaybe<Scalars['Boolean']['input']>
  revisionId: Scalars['String']['input']
}

export type GetRevisionInput = {
  revisionId: Scalars['String']['input']
}

export type GetRevisionTablesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type GetRowChangesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  compareWithRevisionId?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<RowChangesFiltersInput>
  first: Scalars['Int']['input']
  revisionId: Scalars['String']['input']
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

export type GetTableChangesInput = {
  after?: InputMaybe<Scalars['String']['input']>
  compareWithRevisionId?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<TableChangesFiltersInput>
  first: Scalars['Int']['input']
  revisionId: Scalars['String']['input']
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

export type GetTableViewsInput = {
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
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

export type HistoryPatchModel = {
  __typename: 'HistoryPatchModel'
  hash: Scalars['String']['output']
  patches: Array<JsonPatchOperationModel>
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
  /** Default: simple */
  searchLanguage?: InputMaybe<SearchLanguage>
  searchType?: InputMaybe<SearchType>
  string_contains?: InputMaybe<Scalars['String']['input']>
  string_ends_with?: InputMaybe<Scalars['String']['input']>
  string_starts_with?: InputMaybe<Scalars['String']['input']>
}

export enum JsonPatchOp {
  ADD = 'ADD',
  COPY = 'COPY',
  MOVE = 'MOVE',
  REMOVE = 'REMOVE',
  REPLACE = 'REPLACE',
}

export type JsonPatchOperationModel = {
  __typename: 'JsonPatchOperationModel'
  from?: Maybe<Scalars['String']['output']>
  op: JsonPatchOp
  path: Scalars['String']['output']
  value?: Maybe<Scalars['JSON']['output']>
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

export type MeModel = {
  __typename: 'MeModel'
  email?: Maybe<Scalars['String']['output']>
  hasPassword: Scalars['Boolean']['output']
  id: Scalars['String']['output']
  organizationId?: Maybe<Scalars['String']['output']>
  role?: Maybe<RoleModel>
  username?: Maybe<Scalars['String']['output']>
}

export enum MigrationType {
  INIT = 'INIT',
  REMOVE = 'REMOVE',
  RENAME = 'RENAME',
  UPDATE = 'UPDATE',
}

export type ModifiedRowChangeModel = {
  __typename: 'ModifiedRowChangeModel'
  changeType: ChangeType
  fieldChanges: Array<FieldChangeModel>
  fromRow: RowChangeRowModel
  fromTable: RowChangeTableModel
  row: RowChangeRowModel
  table: RowChangeTableModel
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
  createRows: CreateRowsResultModel
  createTable: CreateTableResultModel
  createUser: Scalars['Boolean']['output']
  deleteEndpoint: Scalars['Boolean']['output']
  deleteProject: Scalars['Boolean']['output']
  login: LoginModel
  loginGithub: LoginModel
  loginGoogle: LoginModel
  patchRow: PatchRowResultModel
  patchRows: PatchRowsResultModel
  removeRow: RemoveRowResultModel
  removeRows: RemoveRowsResultModel
  removeTable: RemoveTableResultModel
  removeUserFromOrganization: Scalars['Boolean']['output']
  removeUserFromProject: Scalars['Boolean']['output']
  renameRow: RenameRowResultModel
  renameTable: RenameTableResultModel
  resetPassword: Scalars['Boolean']['output']
  revertChanges: BranchModel
  setUsername: Scalars['Boolean']['output']
  signUp: Scalars['Boolean']['output']
  updatePassword: Scalars['Boolean']['output']
  updateProject: Scalars['Boolean']['output']
  updateRow: UpdateRowResultModel
  updateRows: UpdateRowsResultModel
  updateTable: UpdateTableResultModel
  updateTableViews: TableViewsDataModel
  updateUserProjectRole: Scalars['Boolean']['output']
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

export type MutationCreateRowsArgs = {
  data: CreateRowsInput
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

export type MutationPatchRowsArgs = {
  data: PatchRowsInput
}

export type MutationRemoveRowArgs = {
  data: RemoveRowInput
}

export type MutationRemoveRowsArgs = {
  data: RemoveRowsInput
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

export type MutationResetPasswordArgs = {
  data: ResetPasswordInput
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

export type MutationUpdateRowsArgs = {
  data: UpdateRowsInput
}

export type MutationUpdateTableArgs = {
  data: UpdateTableInput
}

export type MutationUpdateTableViewsArgs = {
  data: UpdateTableViewsInput
}

export type MutationUpdateUserProjectRoleArgs = {
  data: UpdateUserProjectRoleInput
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
  PUBLISHEDAT = 'publishedAt',
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

export type OrganizationModel = {
  __typename: 'OrganizationModel'
  createdId: Scalars['String']['output']
  id: Scalars['String']['output']
  userOrganization?: Maybe<UsersOrganizationModel>
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

export type PatchRowsInput = {
  revisionId: Scalars['String']['input']
  rows: Array<PatchRowsRowInput>
  tableId: Scalars['String']['input']
}

export type PatchRowsResultModel = {
  __typename: 'PatchRowsResultModel'
  previousVersionTableId: Scalars['String']['output']
  rows: Array<RowModel>
  table: TableModel
}

export type PatchRowsRowInput = {
  patches: Array<PatchRow>
  rowId: Scalars['String']['input']
}

export type PermissionModel = {
  __typename: 'PermissionModel'
  action: Scalars['String']['output']
  condition?: Maybe<Scalars['JSON']['output']>
  id: Scalars['String']['output']
  subject: Scalars['String']['output']
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
  organization: OrganizationModel
  organizationId: Scalars['String']['output']
  rootBranch: BranchModel
  userProject?: Maybe<UsersProjectModel>
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
  me: MeModel
  meProjects: ProjectsConnection
  project: ProjectModel
  projectEndpoints: EndpointsConnection
  projects: ProjectsConnection
  revision: RevisionModel
  revisionChanges: RevisionChangesModel
  row?: Maybe<RowModel>
  rowChanges: RowChangesConnection
  rows: RowsConnection
  searchRows: SearchResultsConnection
  searchUsers: UsersConnection
  table?: Maybe<TableModel>
  tableChanges: TableChangesConnection
  tableViews: TableViewsDataModel
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

export type QueryProjectEndpointsArgs = {
  data: GetProjectEndpointsInput
}

export type QueryProjectsArgs = {
  data: GetProjectsInput
}

export type QueryRevisionArgs = {
  data: GetRevisionInput
}

export type QueryRevisionChangesArgs = {
  data: GetRevisionChangesInput
}

export type QueryRowArgs = {
  data: GetRowInput
}

export type QueryRowChangesArgs = {
  data: GetRowChangesInput
}

export type QueryRowsArgs = {
  data: GetRowsInput
}

export type QuerySearchRowsArgs = {
  data: SearchRowsInput
}

export type QuerySearchUsersArgs = {
  data: SearchUsersInput
}

export type QueryTableArgs = {
  data: GetTableInput
}

export type QueryTableChangesArgs = {
  data: GetTableChangesInput
}

export type QueryTableViewsArgs = {
  data: GetTableViewsInput
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

export type RemoveRowsInput = {
  revisionId: Scalars['String']['input']
  rowIds: Array<Scalars['String']['input']>
  tableId: Scalars['String']['input']
}

export type RemoveRowsResultModel = {
  __typename: 'RemoveRowsResultModel'
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

export type RemovedRowChangeModel = {
  __typename: 'RemovedRowChangeModel'
  changeType: ChangeType
  fieldChanges: Array<FieldChangeModel>
  fromRow: RowChangeRowModel
  fromTable: RowChangeTableModel
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

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type RevertChangesInput = {
  branchName: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type RevisionChangeSummaryModel = {
  __typename: 'RevisionChangeSummaryModel'
  added: Scalars['Int']['output']
  modified: Scalars['Int']['output']
  removed: Scalars['Int']['output']
  renamed: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type RevisionChangesModel = {
  __typename: 'RevisionChangesModel'
  parentRevisionId?: Maybe<Scalars['String']['output']>
  revisionId: Scalars['String']['output']
  rowsSummary: RevisionChangeSummaryModel
  tablesSummary: RevisionChangeSummaryModel
  totalChanges: Scalars['Int']['output']
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
  changes: RevisionChangesModel
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
  migrations: Array<Scalars['JSON']['output']>
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
  permissions: Array<PermissionModel>
}

export type RowChange = AddedRowChangeModel | ModifiedRowChangeModel | RemovedRowChangeModel

export enum RowChangeDetailType {
  FIELD_ADDED = 'FIELD_ADDED',
  FIELD_MODIFIED = 'FIELD_MODIFIED',
  FIELD_MOVED = 'FIELD_MOVED',
  FIELD_REMOVED = 'FIELD_REMOVED',
}

export type RowChangeEdge = {
  __typename: 'RowChangeEdge'
  cursor: Scalars['String']['output']
  node: RowChange
}

export type RowChangeRowModel = {
  __typename: 'RowChangeRowModel'
  createdAt: Scalars['DateTime']['output']
  createdId: Scalars['String']['output']
  data: Scalars['JSON']['output']
  hash: Scalars['String']['output']
  id: Scalars['String']['output']
  meta: Scalars['JSON']['output']
  publishedAt: Scalars['DateTime']['output']
  readonly: Scalars['Boolean']['output']
  schemaHash: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  versionId: Scalars['String']['output']
}

export type RowChangeTableModel = {
  __typename: 'RowChangeTableModel'
  createdAt: Scalars['DateTime']['output']
  createdId: Scalars['String']['output']
  id: Scalars['String']['output']
  readonly: Scalars['Boolean']['output']
  system: Scalars['Boolean']['output']
  updatedAt: Scalars['DateTime']['output']
  versionId: Scalars['String']['output']
}

export type RowChangesConnection = {
  __typename: 'RowChangesConnection'
  edges: Array<RowChangeEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type RowChangesFiltersInput = {
  changeTypes?: InputMaybe<Array<ChangeType>>
  includeSystem?: InputMaybe<Scalars['Boolean']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  tableId?: InputMaybe<Scalars['String']['input']>
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

export type SchemaFieldChangeModel = {
  __typename: 'SchemaFieldChangeModel'
  changeType: Scalars['String']['output']
  fieldPath: Scalars['String']['output']
  movedFrom?: Maybe<Scalars['String']['output']>
  movedTo?: Maybe<Scalars['String']['output']>
  newSchema?: Maybe<Scalars['JSON']['output']>
  oldSchema?: Maybe<Scalars['JSON']['output']>
}

export type SchemaMigrationDetailModel = {
  __typename: 'SchemaMigrationDetailModel'
  historyPatches?: Maybe<Array<HistoryPatchModel>>
  initialSchema?: Maybe<Scalars['JSON']['output']>
  migrationId: Scalars['String']['output']
  migrationType: MigrationType
  newTableId?: Maybe<Scalars['String']['output']>
  oldTableId?: Maybe<Scalars['String']['output']>
  patches?: Maybe<Array<JsonPatchOperationModel>>
}

export enum SearchIn {
  ALL = 'all',
  BOOLEANS = 'booleans',
  KEYS = 'keys',
  NUMBERS = 'numbers',
  STRINGS = 'strings',
  VALUES = 'values',
}

/** Language for full-text search. Default: simple */
export enum SearchLanguage {
  ARABIC = 'arabic',
  ARMENIAN = 'armenian',
  BASQUE = 'basque',
  CATALAN = 'catalan',
  DANISH = 'danish',
  DUTCH = 'dutch',
  ENGLISH = 'english',
  FINNISH = 'finnish',
  FRENCH = 'french',
  GERMAN = 'german',
  GREEK = 'greek',
  HINDI = 'hindi',
  HUNGARIAN = 'hungarian',
  INDONESIAN = 'indonesian',
  IRISH = 'irish',
  ITALIAN = 'italian',
  LITHUANIAN = 'lithuanian',
  NEPALI = 'nepali',
  NORWEGIAN = 'norwegian',
  PORTUGUESE = 'portuguese',
  ROMANIAN = 'romanian',
  RUSSIAN = 'russian',
  SERBIAN = 'serbian',
  SIMPLE = 'simple',
  SPANISH = 'spanish',
  SWEDISH = 'swedish',
  TAMIL = 'tamil',
  TURKISH = 'turkish',
  YIDDISH = 'yiddish',
}

export type SearchMatch = {
  __typename: 'SearchMatch'
  highlight?: Maybe<Scalars['String']['output']>
  path: Scalars['String']['output']
  value: Scalars['JSON']['output']
}

export type SearchResult = {
  __typename: 'SearchResult'
  matches: Array<SearchMatch>
  row: RowModel
  table: TableModel
}

export type SearchResultEdge = {
  __typename: 'SearchResultEdge'
  cursor: Scalars['String']['output']
  node: SearchResult
}

export type SearchResultsConnection = {
  __typename: 'SearchResultsConnection'
  edges: Array<SearchResultEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type SearchRowsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  query: Scalars['String']['input']
  revisionId: Scalars['String']['input']
}

export enum SearchType {
  PHRASE = 'phrase',
  PLAIN = 'plain',
  PREFIX = 'prefix',
  TSQUERY = 'tsquery',
}

export type SearchUsersInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  search?: InputMaybe<Scalars['String']['input']>
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

export type TableChangeModel = {
  __typename: 'TableChangeModel'
  addedRowsCount: Scalars['Int']['output']
  changeType: ChangeType
  fromVersionId?: Maybe<Scalars['String']['output']>
  modifiedRowsCount: Scalars['Int']['output']
  newTableId?: Maybe<Scalars['String']['output']>
  oldTableId?: Maybe<Scalars['String']['output']>
  removedRowsCount: Scalars['Int']['output']
  renamedRowsCount: Scalars['Int']['output']
  rowChangesCount: Scalars['Int']['output']
  schemaMigrations: Array<SchemaMigrationDetailModel>
  tableCreatedId: Scalars['String']['output']
  tableId: Scalars['String']['output']
  toVersionId?: Maybe<Scalars['String']['output']>
  viewsChanges: ViewsChangeDetailModel
}

export type TableChangeModelEdge = {
  __typename: 'TableChangeModelEdge'
  cursor: Scalars['String']['output']
  node: TableChangeModel
}

export type TableChangesConnection = {
  __typename: 'TableChangesConnection'
  edges: Array<TableChangeModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type TableChangesFiltersInput = {
  changeTypes?: InputMaybe<Array<ChangeType>>
  includeSystem?: InputMaybe<Scalars['Boolean']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  withSchemaMigrations?: InputMaybe<Scalars['Boolean']['input']>
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
  views: TableViewsDataModel
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

export type TableViewsDataInput = {
  defaultViewId: Scalars['String']['input']
  version: Scalars['Int']['input']
  views: Array<ViewInput>
}

export type TableViewsDataModel = {
  __typename: 'TableViewsDataModel'
  defaultViewId: Scalars['String']['output']
  version: Scalars['Int']['output']
  views: Array<ViewModel>
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

export type UpdateRowsInput = {
  revisionId: Scalars['String']['input']
  rows: Array<UpdateRowsRowInput>
  tableId: Scalars['String']['input']
}

export type UpdateRowsResultModel = {
  __typename: 'UpdateRowsResultModel'
  previousVersionTableId: Scalars['String']['output']
  rows: Array<RowModel>
  table: TableModel
}

export type UpdateRowsRowInput = {
  data: Scalars['JSON']['input']
  rowId: Scalars['String']['input']
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

export type UpdateTableViewsInput = {
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
  viewsData: TableViewsDataInput
}

export type UpdateUserProjectRoleInput = {
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  roleId: UserProjectRoles
  userId: Scalars['String']['input']
}

export type UserModel = {
  __typename: 'UserModel'
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  organizationId?: Maybe<Scalars['String']['output']>
  role?: Maybe<RoleModel>
  username?: Maybe<Scalars['String']['output']>
}

export type UserModelEdge = {
  __typename: 'UserModelEdge'
  cursor: Scalars['String']['output']
  node: UserModel
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

export type UsersConnection = {
  __typename: 'UsersConnection'
  edges: Array<UserModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
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

export type ViewChangeModel = {
  __typename: 'ViewChangeModel'
  changeType: ChangeType
  oldViewName?: Maybe<Scalars['String']['output']>
  viewId: Scalars['String']['output']
  viewName: Scalars['String']['output']
}

export type ViewColumnInput = {
  field: Scalars['String']['input']
  width?: InputMaybe<Scalars['Float']['input']>
}

export type ViewColumnModel = {
  __typename: 'ViewColumnModel'
  field: Scalars['String']['output']
  width?: Maybe<Scalars['Float']['output']>
}

export type ViewInput = {
  columns?: InputMaybe<Array<ViewColumnInput>>
  description?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSON']['input']>
  id: Scalars['String']['input']
  name: Scalars['String']['input']
  search?: InputMaybe<Scalars['String']['input']>
  sorts?: InputMaybe<Array<ViewSortInput>>
}

export type ViewModel = {
  __typename: 'ViewModel'
  columns?: Maybe<Array<ViewColumnModel>>
  description?: Maybe<Scalars['String']['output']>
  filters?: Maybe<Scalars['JSON']['output']>
  id: Scalars['String']['output']
  name: Scalars['String']['output']
  search?: Maybe<Scalars['String']['output']>
  sorts?: Maybe<Array<ViewSortModel>>
}

export type ViewSortInput = {
  direction: SortOrder
  field: Scalars['String']['input']
}

export type ViewSortModel = {
  __typename: 'ViewSortModel'
  direction: Scalars['String']['output']
  field: Scalars['String']['output']
}

export type ViewsChangeDetailModel = {
  __typename: 'ViewsChangeDetailModel'
  addedCount: Scalars['Int']['output']
  changes: Array<ViewChangeModel>
  hasChanges: Scalars['Boolean']['output']
  modifiedCount: Scalars['Int']['output']
  removedCount: Scalars['Int']['output']
  renamedCount: Scalars['Int']['output']
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
