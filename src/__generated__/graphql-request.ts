// @ts-ignore
import { GraphQLClient, RequestOptions } from 'graphql-request'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders']
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
  changeType: ChangeType
  fieldChanges: Array<FieldChangeModel>
  row: RowChangeRowModel
  table: RowChangeTableModel
}

export type AdminUserInput = {
  userId: Scalars['String']['input']
}

export type ApplyMigrationResultModel = {
  error?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  status: ApplyMigrationStatus
}

/** Status of migration application */
export enum ApplyMigrationStatus {
  Applied = 'applied',
  Failed = 'failed',
  Skipped = 'skipped',
}

export type ApplyMigrationsInput = {
  migrations: Array<Scalars['JSON']['input']>
  revisionId: Scalars['String']['input']
}

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>
  not?: InputMaybe<Scalars['Boolean']['input']>
}

export type BranchModel = {
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
  cursor: Scalars['String']['output']
  node: BranchModel
}

export type BranchesConnection = {
  edges: Array<BranchModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export enum ChangeType {
  Added = 'ADDED',
  Modified = 'MODIFIED',
  Removed = 'REMOVED',
  Renamed = 'RENAMED',
  RenamedAndModified = 'RENAMED_AND_MODIFIED',
}

export type ChildBranchModel = {
  branch: BranchModel
  revision: RevisionModel
}

export type ConfigurationModel = {
  availableEmailSignUp: Scalars['Boolean']['output']
  github: GithubOauth
  google: GoogleOauth
  plugins: PluginsModel
}

export type ConfirmEmailCodeInput = {
  code: Scalars['String']['input']
}

export type CreateBranchInput = {
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

export type DeleteBranchInput = {
  branchName: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type DeleteEndpointInput = {
  endpointId: Scalars['String']['input']
}

export type DeleteProjectInput = {
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type DeleteRowInput = {
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type DeleteRowResultModel = {
  branch: BranchModel
  previousVersionTableId?: Maybe<Scalars['String']['output']>
  table?: Maybe<TableModel>
}

export type DeleteRowsInput = {
  revisionId: Scalars['String']['input']
  rowIds: Array<Scalars['String']['input']>
  tableId: Scalars['String']['input']
}

export type DeleteRowsResultModel = {
  branch: BranchModel
  previousVersionTableId?: Maybe<Scalars['String']['output']>
  table?: Maybe<TableModel>
}

export type DeleteTableInput = {
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type DeleteTableResultModel = {
  branch: BranchModel
}

export type EndpointModel = {
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  revision: RevisionModel
  revisionId: Scalars['String']['output']
  type: EndpointType
}

export type EndpointModelEdge = {
  cursor: Scalars['String']['output']
  node: EndpointModel
}

export enum EndpointType {
  Graphql = 'GRAPHQL',
  RestApi = 'REST_API',
}

export type EndpointsConnection = {
  edges: Array<EndpointModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type FieldChangeModel = {
  changeType: RowChangeDetailType
  fieldPath: Scalars['String']['output']
  movedFrom?: Maybe<Scalars['String']['output']>
  newValue?: Maybe<Scalars['JSON']['output']>
  oldValue?: Maybe<Scalars['JSON']['output']>
}

export type FormulaFieldErrorModel = {
  defaultUsed: Scalars['Boolean']['output']
  error: Scalars['String']['output']
  expression: Scalars['String']['output']
  field: Scalars['String']['output']
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

export type GetSubSchemaItemsInput = {
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  orderBy?: InputMaybe<Array<SubSchemaOrderByItemInput>>
  revisionId: Scalars['String']['input']
  schemaId: Scalars['String']['input']
  where?: InputMaybe<SubSchemaWhereInput>
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
  available: Scalars['Boolean']['output']
  clientId?: Maybe<Scalars['String']['output']>
}

export type GoogleOauth = {
  available: Scalars['Boolean']['output']
  clientId?: Maybe<Scalars['String']['output']>
}

export type HistoryPatchModel = {
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
  Add = 'ADD',
  Copy = 'COPY',
  Move = 'MOVE',
  Remove = 'REMOVE',
  Replace = 'REPLACE',
}

export type JsonPatchOperationModel = {
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
  accessToken: Scalars['String']['output']
}

export type MeModel = {
  email?: Maybe<Scalars['String']['output']>
  hasPassword: Scalars['Boolean']['output']
  id: Scalars['String']['output']
  organization?: Maybe<OrganizationModel>
  organizationId?: Maybe<Scalars['String']['output']>
  role?: Maybe<RoleModel>
  username?: Maybe<Scalars['String']['output']>
}

export enum MigrationType {
  Init = 'INIT',
  Remove = 'REMOVE',
  Rename = 'RENAME',
  Update = 'UPDATE',
}

export type ModifiedRowChangeModel = {
  changeType: ChangeType
  fieldChanges: Array<FieldChangeModel>
  fromRow: RowChangeRowModel
  fromTable: RowChangeTableModel
  row: RowChangeRowModel
  table: RowChangeTableModel
}

export type Mutation = {
  addUserToOrganization: Scalars['Boolean']['output']
  addUserToProject: Scalars['Boolean']['output']
  applyMigrations: Array<ApplyMigrationResultModel>
  confirmEmailCode: LoginModel
  createBranch: BranchModel
  createEndpoint: EndpointModel
  createProject: ProjectModel
  createRevision: RevisionModel
  createRow: CreateRowResultModel
  createRows: CreateRowsResultModel
  createTable: CreateTableResultModel
  createUser: Scalars['Boolean']['output']
  deleteBranch: Scalars['Boolean']['output']
  deleteEndpoint: Scalars['Boolean']['output']
  deleteProject: Scalars['Boolean']['output']
  deleteRow: DeleteRowResultModel
  deleteRows: DeleteRowsResultModel
  deleteTable: DeleteTableResultModel
  login: LoginModel
  loginGithub: LoginModel
  loginGoogle: LoginModel
  patchRow: PatchRowResultModel
  patchRows: PatchRowsResultModel
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

export type MutationApplyMigrationsArgs = {
  data: ApplyMigrationsInput
}

export type MutationConfirmEmailCodeArgs = {
  data: ConfirmEmailCodeInput
}

export type MutationCreateBranchArgs = {
  data: CreateBranchInput
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

export type MutationDeleteBranchArgs = {
  data: DeleteBranchInput
}

export type MutationDeleteEndpointArgs = {
  data: DeleteEndpointInput
}

export type MutationDeleteProjectArgs = {
  data: DeleteProjectInput
}

export type MutationDeleteRowArgs = {
  data: DeleteRowInput
}

export type MutationDeleteRowsArgs = {
  data: DeleteRowsInput
}

export type MutationDeleteTableArgs = {
  data: DeleteTableInput
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

export enum NullsPosition {
  First = 'first',
  Last = 'last',
}

export type OrderBy = {
  aggregation?: InputMaybe<OrderDataAggregation>
  direction: SortOrder
  field: OrderByField
  path?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<OrderDataType>
}

export enum OrderByField {
  CreatedAt = 'createdAt',
  Data = 'data',
  Id = 'id',
  PublishedAt = 'publishedAt',
  UpdatedAt = 'updatedAt',
}

export enum OrderDataAggregation {
  Avg = 'avg',
  First = 'first',
  Last = 'last',
  Max = 'max',
  Min = 'min',
}

export enum OrderDataType {
  Boolean = 'boolean',
  Float = 'float',
  Int = 'int',
  Text = 'text',
  Timestamp = 'timestamp',
}

export type OrganizationModel = {
  createdId: Scalars['String']['output']
  id: Scalars['String']['output']
  userOrganization?: Maybe<UsersOrganizationModel>
}

export type PageInfo = {
  endCursor?: Maybe<Scalars['String']['output']>
  hasNextPage: Scalars['Boolean']['output']
  hasPreviousPage: Scalars['Boolean']['output']
  startCursor?: Maybe<Scalars['String']['output']>
}

export type ParentBranchModel = {
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
  Replace = 'replace',
}

export type PatchRowResultModel = {
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
  previousVersionTableId: Scalars['String']['output']
  rows: Array<RowModel>
  table: TableModel
}

export type PatchRowsRowInput = {
  patches: Array<PatchRow>
  rowId: Scalars['String']['input']
}

export type PermissionModel = {
  action: Scalars['String']['output']
  condition?: Maybe<Scalars['JSON']['output']>
  id: Scalars['String']['output']
  subject: Scalars['String']['output']
}

export type PluginsModel = {
  file: Scalars['Boolean']['output']
  formula: Scalars['Boolean']['output']
}

export type ProjectModel = {
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
  cursor: Scalars['String']['output']
  node: ProjectModel
}

export type ProjectsConnection = {
  edges: Array<ProjectModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Query = {
  adminUser?: Maybe<UserModel>
  adminUsers: UsersConnection
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
  searchUsers: SearchUsersConnection
  subSchemaItems: SubSchemaItemsConnection
  table?: Maybe<TableModel>
  tableChanges: TableChangesConnection
  tableViews: TableViewsDataModel
  tables: TablesConnection
  usersOrganization: UsersOrganizationConnection
  usersProject: UsersProjectConnection
}

export type QueryAdminUserArgs = {
  data: AdminUserInput
}

export type QueryAdminUsersArgs = {
  data: SearchUsersInput
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

export type QuerySubSchemaItemsArgs = {
  data: GetSubSchemaItemsInput
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
  Default = 'default',
  Insensitive = 'insensitive',
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
  added: Scalars['Int']['output']
  modified: Scalars['Int']['output']
  removed: Scalars['Int']['output']
  renamed: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type RevisionChangesModel = {
  parentRevisionId?: Maybe<Scalars['String']['output']>
  revisionId: Scalars['String']['output']
  rowsSummary: RevisionChangeSummaryModel
  tablesSummary: RevisionChangeSummaryModel
  totalChanges: Scalars['Int']['output']
}

export type RevisionConnection = {
  edges: Array<RevisionModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type RevisionModel = {
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
  cursor: Scalars['String']['output']
  node: RevisionModel
}

export type RoleModel = {
  id: Scalars['String']['output']
  name: Scalars['String']['output']
  permissions: Array<PermissionModel>
}

export type RowChange = AddedRowChangeModel | ModifiedRowChangeModel | RemovedRowChangeModel

export enum RowChangeDetailType {
  FieldAdded = 'FIELD_ADDED',
  FieldModified = 'FIELD_MODIFIED',
  FieldMoved = 'FIELD_MOVED',
  FieldRemoved = 'FIELD_REMOVED',
}

export type RowChangeEdge = {
  cursor: Scalars['String']['output']
  node: RowChange
}

export type RowChangeRowModel = {
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
  createdAt: Scalars['DateTime']['output']
  createdId: Scalars['String']['output']
  id: Scalars['String']['output']
  readonly: Scalars['Boolean']['output']
  system: Scalars['Boolean']['output']
  updatedAt: Scalars['DateTime']['output']
  versionId: Scalars['String']['output']
}

export type RowChangesConnection = {
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
  countForeignKeysTo: Scalars['Int']['output']
  createdAt: Scalars['DateTime']['output']
  createdId: Scalars['String']['output']
  data: Scalars['JSON']['output']
  formulaErrors?: Maybe<Array<FormulaFieldErrorModel>>
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
  cursor: Scalars['String']['output']
  node: RowModel
}

export type RowsConnection = {
  edges: Array<RowModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type SchemaFieldChangeModel = {
  changeType: Scalars['String']['output']
  fieldPath: Scalars['String']['output']
  movedFrom?: Maybe<Scalars['String']['output']>
  movedTo?: Maybe<Scalars['String']['output']>
  newSchema?: Maybe<Scalars['JSON']['output']>
  oldSchema?: Maybe<Scalars['JSON']['output']>
}

export type SchemaMigrationDetailModel = {
  historyPatches?: Maybe<Array<HistoryPatchModel>>
  initialSchema?: Maybe<Scalars['JSON']['output']>
  migrationId: Scalars['String']['output']
  migrationType: MigrationType
  newTableId?: Maybe<Scalars['String']['output']>
  oldTableId?: Maybe<Scalars['String']['output']>
  patches?: Maybe<Array<JsonPatchOperationModel>>
}

export enum SearchIn {
  All = 'all',
  Booleans = 'booleans',
  Keys = 'keys',
  Numbers = 'numbers',
  Strings = 'strings',
  Values = 'values',
}

/** Language for full-text search. Default: simple */
export enum SearchLanguage {
  Arabic = 'arabic',
  Armenian = 'armenian',
  Basque = 'basque',
  Catalan = 'catalan',
  Danish = 'danish',
  Dutch = 'dutch',
  English = 'english',
  Finnish = 'finnish',
  French = 'french',
  German = 'german',
  Greek = 'greek',
  Hindi = 'hindi',
  Hungarian = 'hungarian',
  Indonesian = 'indonesian',
  Irish = 'irish',
  Italian = 'italian',
  Lithuanian = 'lithuanian',
  Nepali = 'nepali',
  Norwegian = 'norwegian',
  Portuguese = 'portuguese',
  Romanian = 'romanian',
  Russian = 'russian',
  Serbian = 'serbian',
  Simple = 'simple',
  Spanish = 'spanish',
  Swedish = 'swedish',
  Tamil = 'tamil',
  Turkish = 'turkish',
  Yiddish = 'yiddish',
}

export type SearchMatch = {
  highlight?: Maybe<Scalars['String']['output']>
  path: Scalars['String']['output']
  value: Scalars['JSON']['output']
}

export type SearchResult = {
  formulaErrors?: Maybe<Array<FormulaFieldErrorModel>>
  matches: Array<SearchMatch>
  row: RowModel
  table: TableModel
}

export type SearchResultEdge = {
  cursor: Scalars['String']['output']
  node: SearchResult
}

export type SearchResultsConnection = {
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
  Phrase = 'phrase',
  Plain = 'plain',
  Prefix = 'prefix',
  Tsquery = 'tsquery',
}

export type SearchUserModel = {
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  username?: Maybe<Scalars['String']['output']>
}

export type SearchUserModelEdge = {
  cursor: Scalars['String']['output']
  node: SearchUserModel
}

export type SearchUsersConnection = {
  edges: Array<SearchUserModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
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
  Asc = 'asc',
  Desc = 'desc',
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

export type SubSchemaDataOrderByInput = {
  nulls?: InputMaybe<NullsPosition>
  order: SortOrder
  path: Scalars['JSON']['input']
}

export type SubSchemaItemModel = {
  data: Scalars['JSON']['output']
  fieldPath: Scalars['String']['output']
  row: RowModel
  table: TableModel
}

export type SubSchemaItemModelEdge = {
  cursor: Scalars['String']['output']
  node: SubSchemaItemModel
}

export type SubSchemaItemsConnection = {
  edges: Array<SubSchemaItemModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type SubSchemaJsonFilterInput = {
  equals?: InputMaybe<Scalars['JSON']['input']>
  gt?: InputMaybe<Scalars['JSON']['input']>
  gte?: InputMaybe<Scalars['JSON']['input']>
  in?: InputMaybe<Array<Scalars['JSON']['input']>>
  lt?: InputMaybe<Scalars['JSON']['input']>
  lte?: InputMaybe<Scalars['JSON']['input']>
  mode?: InputMaybe<QueryMode>
  not?: InputMaybe<Scalars['JSON']['input']>
  notIn?: InputMaybe<Array<Scalars['JSON']['input']>>
  path: Scalars['JSON']['input']
  string_contains?: InputMaybe<Scalars['String']['input']>
  string_ends_with?: InputMaybe<Scalars['String']['input']>
  string_starts_with?: InputMaybe<Scalars['String']['input']>
}

export type SubSchemaOrderByItemInput = {
  data?: InputMaybe<SubSchemaDataOrderByInput>
  fieldPath?: InputMaybe<SortOrder>
  rowCreatedAt?: InputMaybe<SortOrder>
  rowId?: InputMaybe<SortOrder>
  tableId?: InputMaybe<SortOrder>
}

export type SubSchemaStringFilterInput = {
  contains?: InputMaybe<Scalars['String']['input']>
  endsWith?: InputMaybe<Scalars['String']['input']>
  equals?: InputMaybe<Scalars['String']['input']>
  gt?: InputMaybe<Scalars['String']['input']>
  gte?: InputMaybe<Scalars['String']['input']>
  in?: InputMaybe<Array<Scalars['String']['input']>>
  lt?: InputMaybe<Scalars['String']['input']>
  lte?: InputMaybe<Scalars['String']['input']>
  mode?: InputMaybe<QueryMode>
  not?: InputMaybe<Scalars['String']['input']>
  notIn?: InputMaybe<Array<Scalars['String']['input']>>
  startsWith?: InputMaybe<Scalars['String']['input']>
}

export type SubSchemaWhereInput = {
  AND?: InputMaybe<Array<SubSchemaWhereInput>>
  NOT?: InputMaybe<SubSchemaWhereInput>
  OR?: InputMaybe<Array<SubSchemaWhereInput>>
  data?: InputMaybe<SubSchemaJsonFilterInput>
  fieldPath?: InputMaybe<SubSchemaStringFilterInput>
  rowId?: InputMaybe<SubSchemaStringFilterInput>
  tableId?: InputMaybe<SubSchemaStringFilterInput>
}

export type TableChangeModel = {
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
  cursor: Scalars['String']['output']
  node: TableChangeModel
}

export type TableChangesConnection = {
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
  cursor: Scalars['String']['output']
  node: TableModel
}

export type TableViewsDataInput = {
  defaultViewId: Scalars['String']['input']
  version: Scalars['Int']['input']
  views: Array<ViewInput>
}

export type TableViewsDataModel = {
  defaultViewId: Scalars['String']['output']
  version: Scalars['Int']['output']
  views: Array<ViewModel>
}

export type TablesConnection = {
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
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  organizationId?: Maybe<Scalars['String']['output']>
  role: RoleModel
  roleId: Scalars['String']['output']
  username?: Maybe<Scalars['String']['output']>
}

export type UserModelEdge = {
  cursor: Scalars['String']['output']
  node: UserModel
}

export enum UserOrganizationRoles {
  Developer = 'developer',
  Editor = 'editor',
  OrganizationAdmin = 'organizationAdmin',
  OrganizationOwner = 'organizationOwner',
  Reader = 'reader',
}

export enum UserProjectRoles {
  Developer = 'developer',
  Editor = 'editor',
  Reader = 'reader',
}

export enum UserSystemRole {
  SystemAdmin = 'systemAdmin',
  SystemFullApiRead = 'systemFullApiRead',
  SystemUser = 'systemUser',
}

export type UsersConnection = {
  edges: Array<UserModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type UsersOrganizationConnection = {
  edges: Array<UsersOrganizationModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type UsersOrganizationModel = {
  id: Scalars['String']['output']
  role: RoleModel
  user: UserModel
}

export type UsersOrganizationModelEdge = {
  cursor: Scalars['String']['output']
  node: UsersOrganizationModel
}

export type UsersProjectConnection = {
  edges: Array<UsersProjectModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type UsersProjectModel = {
  id: Scalars['String']['output']
  role: RoleModel
  user: UserModel
}

export type UsersProjectModelEdge = {
  cursor: Scalars['String']['output']
  node: UsersProjectModel
}

export type ViewChangeModel = {
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
  direction: Scalars['String']['output']
  field: Scalars['String']['output']
}

export type ViewsChangeDetailModel = {
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

export type BranchLoaderFragmentFragment = {
  id: string
  createdAt: string
  name: string
  touched: boolean
  projectId: string
  head: { id: string }
  draft: { id: string }
}

export type GetBranchForLoaderQueryVariables = Exact<{
  data: GetBranchInput
}>

export type GetBranchForLoaderQuery = {
  branch: {
    id: string
    createdAt: string
    name: string
    touched: boolean
    projectId: string
    head: { id: string }
    draft: { id: string }
  }
}

export type GetProjectQueryVariables = Exact<{
  data: GetProjectInput
}>

export type GetProjectQuery = {
  project: {
    id: string
    organizationId: string
    createdAt: string
    name: string
    isPublic: boolean
    userProject?: {
      id: string
      role: {
        id: string
        name: string
        permissions: Array<{
          id: string
          action: string
          subject: string
          condition?: { [key: string]: any } | string | number | boolean | null | null
        }>
      }
    } | null
    organization: {
      id: string
      userOrganization?: {
        id: string
        role: {
          id: string
          name: string
          permissions: Array<{
            id: string
            action: string
            subject: string
            condition?: { [key: string]: any } | string | number | boolean | null | null
          }>
        }
      } | null
    }
  }
}

export type BranchFragmentFragment = {
  id: string
  createdAt: string
  name: string
  touched: boolean
  projectId: string
  head: { id: string }
  draft: { id: string }
}

export type ProjectLoaderFragmentFragment = {
  id: string
  organizationId: string
  createdAt: string
  name: string
  isPublic: boolean
  rootBranch: {
    id: string
    createdAt: string
    name: string
    touched: boolean
    projectId: string
    head: { id: string }
    draft: { id: string }
  }
  userProject?: {
    id: string
    role: {
      id: string
      name: string
      permissions: Array<{
        id: string
        action: string
        subject: string
        condition?: { [key: string]: any } | string | number | boolean | null | null
      }>
    }
  } | null
  organization: {
    id: string
    userOrganization?: {
      id: string
      role: {
        id: string
        name: string
        permissions: Array<{
          id: string
          action: string
          subject: string
          condition?: { [key: string]: any } | string | number | boolean | null | null
        }>
      }
    } | null
  }
}

export type GetProjectForLoaderQueryVariables = Exact<{
  data: GetProjectInput
}>

export type GetProjectForLoaderQuery = {
  project: {
    id: string
    organizationId: string
    createdAt: string
    name: string
    isPublic: boolean
    rootBranch: {
      id: string
      createdAt: string
      name: string
      touched: boolean
      projectId: string
      head: { id: string }
      draft: { id: string }
    }
    userProject?: {
      id: string
      role: {
        id: string
        name: string
        permissions: Array<{
          id: string
          action: string
          subject: string
          condition?: { [key: string]: any } | string | number | boolean | null | null
        }>
      }
    } | null
    organization: {
      id: string
      userOrganization?: {
        id: string
        role: {
          id: string
          name: string
          permissions: Array<{
            id: string
            action: string
            subject: string
            condition?: { [key: string]: any } | string | number | boolean | null | null
          }>
        }
      } | null
    }
  }
}

export type GetRevisionForLoaderQueryVariables = Exact<{
  data: GetRevisionInput
}>

export type GetRevisionForLoaderQuery = { revision: { id: string } }

export type RowLoaderFragmentFragment = {
  createdId: string
  id: string
  versionId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  data: { [key: string]: any } | string | number | boolean | null
}

export type GetRowForLoaderQueryVariables = Exact<{
  data: GetRowInput
}>

export type GetRowForLoaderQuery = {
  row?: {
    createdId: string
    id: string
    versionId: string
    createdAt: string
    updatedAt: string
    readonly: boolean
    data: { [key: string]: any } | string | number | boolean | null
  } | null
}

export type GetRowCountForeignKeysToForLoaderQueryVariables = Exact<{
  data: GetRowInput
}>

export type GetRowCountForeignKeysToForLoaderQuery = { row?: { id: string; countForeignKeysTo: number } | null }

export type ForeignKeysByQueryVariables = Exact<{
  tableData: GetTableInput
  foreignKeyTablesData: GetTableForeignKeysInput
}>

export type ForeignKeysByQuery = {
  table?: {
    id: string
    foreignKeysBy: {
      totalCount: number
      pageInfo: { hasNextPage: boolean; endCursor?: string | null }
      edges: Array<{ node: { id: string } }>
    }
  } | null
}

export type ForeignKeysByRowsQueryVariables = Exact<{
  rowData: GetRowInput
  foreignKeyRowsData: GetRowForeignKeysInput
}>

export type ForeignKeysByRowsQuery = {
  row?: {
    id: string
    rowForeignKeysBy: {
      totalCount: number
      pageInfo: { hasNextPage: boolean; endCursor?: string | null }
      edges: Array<{
        node: { id: string; versionId: string; data: { [key: string]: any } | string | number | boolean | null }
      }>
    }
  } | null
}

export type TableLoaderFragmentFragment = {
  createdId: string
  id: string
  versionId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type GetTableForLoaderQueryVariables = Exact<{
  data: GetTableInput
}>

export type GetTableForLoaderQuery = {
  table?: {
    createdId: string
    id: string
    versionId: string
    createdAt: string
    updatedAt: string
    readonly: boolean
    count: number
    schema: { [key: string]: any } | string | number | boolean | null
  } | null
}

export type UpdatePasswordMutationVariables = Exact<{
  data: UpdatePasswordInput
}>

export type UpdatePasswordMutation = { updatePassword: boolean }

export type CreateProjectMutationVariables = Exact<{
  data: CreateProjectInput
}>

export type CreateProjectMutation = { createProject: { id: string; name: string; organizationId: string } }

export type FindForeignKeyQueryVariables = Exact<{
  data: GetRowsInput
}>

export type FindForeignKeyQuery = {
  rows: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
    edges: Array<{ cursor: string; node: { id: string } }>
  }
}

export type AdminDashboardStatsQueryVariables = Exact<{
  first: Scalars['Int']['input']
}>

export type AdminDashboardStatsQuery = { searchUsers: { totalCount: number } }

export type AdminUserDetailFragment = {
  id: string
  email?: string | null
  username?: string | null
  role: { id: string; name: string }
}

export type AdminGetUserQueryVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminGetUserQuery = {
  adminUser?: { id: string; email?: string | null; username?: string | null; role: { id: string; name: string } } | null
}

export type AdminResetPasswordMutationVariables = Exact<{
  userId: Scalars['String']['input']
  newPassword: Scalars['String']['input']
}>

export type AdminResetPasswordMutation = { resetPassword: boolean }

export type AdminUserItemFragment = {
  id: string
  email?: string | null
  username?: string | null
  role: { id: string; name: string }
}

export type AdminUsersQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  after?: InputMaybe<Scalars['String']['input']>
}>

export type AdminUsersQuery = {
  adminUsers: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: { id: string; email?: string | null; username?: string | null; role: { id: string; name: string } }
    }>
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
  }
}

export type AdminUserQueryVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminUserQuery = {
  adminUser?: { id: string; email?: string | null; username?: string | null; role: { id: string; name: string } } | null
}

export type AssetTableItemFragment = {
  id: string
  versionId: string
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type AssetsTablesDataQueryVariables = Exact<{
  data: GetTablesInput
}>

export type AssetsTablesDataQuery = {
  tables: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    edges: Array<{
      node: {
        id: string
        versionId: string
        count: number
        schema: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export type AssetRowItemFragment = {
  id: string
  versionId: string
  data: { [key: string]: any } | string | number | boolean | null
}

export type AssetsRowsDataQueryVariables = Exact<{
  data: GetRowsInput
}>

export type AssetsRowsDataQuery = {
  rows: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    edges: Array<{
      node: { id: string; versionId: string; data: { [key: string]: any } | string | number | boolean | null }
    }>
  }
}

export type SubSchemaItemFragment = {
  fieldPath: string
  data: { [key: string]: any } | string | number | boolean | null
  table: { id: string; versionId: string }
  row: { id: string; versionId: string; data: { [key: string]: any } | string | number | boolean | null }
}

export type SubSchemaItemsDataQueryVariables = Exact<{
  data: GetSubSchemaItemsInput
}>

export type SubSchemaItemsDataQuery = {
  subSchemaItems: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    edges: Array<{
      node: {
        fieldPath: string
        data: { [key: string]: any } | string | number | boolean | null
        table: { id: string; versionId: string }
        row: { id: string; versionId: string; data: { [key: string]: any } | string | number | boolean | null }
      }
    }>
  }
}

export type BranchItemFragment = {
  id: string
  name: string
  isRoot: boolean
  touched: boolean
  createdAt: string
  start: { id: string; createdAt: string }
  parent?: {
    revision: { id: string; isDraft: boolean; isHead: boolean; createdAt: string; branch: { id: string; name: string } }
  } | null
}

export type GetProjectBranchesQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type GetProjectBranchesQuery = {
  branches: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
    edges: Array<{
      cursor: string
      node: {
        id: string
        name: string
        isRoot: boolean
        touched: boolean
        createdAt: string
        start: { id: string; createdAt: string }
        parent?: {
          revision: {
            id: string
            isDraft: boolean
            isHead: boolean
            createdAt: string
            branch: { id: string; name: string }
          }
        } | null
      }
    }>
  }
}

export type DeleteBranchMutationVariables = Exact<{
  data: DeleteBranchInput
}>

export type DeleteBranchMutation = { deleteBranch: boolean }

export type RevisionForSelectFragment = {
  id: string
  isDraft: boolean
  isHead: boolean
  createdAt: string
  comment: string
}

export type GetBranchesForSelectQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type GetBranchesForSelectQuery = {
  branches: { edges: Array<{ node: { id: string; name: string; isRoot: boolean } }> }
}

export type GetBranchRevisionsForCreateQueryVariables = Exact<{
  data: GetBranchInput
  revisionsData: GetBranchRevisionsInput
}>

export type GetBranchRevisionsForCreateQuery = {
  branch: {
    id: string
    revisions: {
      totalCount: number
      pageInfo: { hasNextPage: boolean; endCursor?: string | null }
      edges: Array<{ node: { id: string; isDraft: boolean; isHead: boolean; createdAt: string; comment: string } }>
    }
  }
}

export type CreateBranchMutationVariables = Exact<{
  data: CreateBranchInput
}>

export type CreateBranchMutation = { createBranch: { id: string; name: string } }

export type GetRevisionChangesQueryVariables = Exact<{
  revisionId: Scalars['String']['input']
  compareWithRevisionId?: InputMaybe<Scalars['String']['input']>
  includeSystem?: InputMaybe<Scalars['Boolean']['input']>
}>

export type GetRevisionChangesQuery = {
  revisionChanges: {
    revisionId: string
    parentRevisionId?: string | null
    totalChanges: number
    tablesSummary: { added: number; modified: number; removed: number; renamed: number; total: number }
    rowsSummary: { added: number; modified: number; removed: number; renamed: number; total: number }
  }
}

export type GetTableChangesQueryVariables = Exact<{
  revisionId: Scalars['String']['input']
  first: Scalars['Int']['input']
  after?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<TableChangesFiltersInput>
}>

export type GetTableChangesQuery = {
  tableChanges: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: {
        tableId: string
        changeType: ChangeType
        oldTableId?: string | null
        newTableId?: string | null
        rowChangesCount: number
        addedRowsCount: number
        modifiedRowsCount: number
        removedRowsCount: number
        renamedRowsCount: number
        schemaMigrations: Array<{
          migrationType: MigrationType
          migrationId: string
          oldTableId?: string | null
          newTableId?: string | null
          patches?: Array<{
            op: JsonPatchOp
            path: string
            value?: { [key: string]: any } | string | number | boolean | null | null
            from?: string | null
          }> | null
        }>
        viewsChanges: {
          hasChanges: boolean
          addedCount: number
          modifiedCount: number
          removedCount: number
          renamedCount: number
          changes: Array<{ viewId: string; viewName: string; changeType: ChangeType; oldViewName?: string | null }>
        }
      }
    }>
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
  }
}

export type ConfirmEmailCodeMutationVariables = Exact<{
  data: ConfirmEmailCodeInput
}>

export type ConfirmEmailCodeMutation = { confirmEmailCode: { accessToken: string } }

export type EndpointFragment = {
  id: string
  type: EndpointType
  createdAt: string
  revisionId: string
  revision: { id: string; isDraft: boolean; isHead: boolean; createdAt: string; branch: { id: string; name: string } }
}

export type RevisionWithEndpointsFragment = {
  id: string
  comment: string
  isDraft: boolean
  isHead: boolean
  isStart: boolean
  createdAt: string
  endpoints: Array<{ id: string; type: EndpointType }>
}

export type EndpointBranchFragment = {
  id: string
  name: string
  isRoot: boolean
  head: { id: string }
  draft: { id: string }
}

export type GetEndpointBranchesQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type GetEndpointBranchesQuery = {
  branches: {
    totalCount: number
    edges: Array<{ node: { id: string; name: string; isRoot: boolean; head: { id: string }; draft: { id: string } } }>
  }
}

export type GetProjectEndpointsQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  first: Scalars['Int']['input']
  after?: InputMaybe<Scalars['String']['input']>
  branchId?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<EndpointType>
}>

export type GetProjectEndpointsQuery = {
  projectEndpoints: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: {
        id: string
        type: EndpointType
        createdAt: string
        revisionId: string
        revision: {
          id: string
          isDraft: boolean
          isHead: boolean
          createdAt: string
          branch: { id: string; name: string }
        }
      }
    }>
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
  }
}

export type GetBranchRevisionsQueryVariables = Exact<{
  data: GetBranchInput
  revisionsData: GetBranchRevisionsInput
}>

export type GetBranchRevisionsQuery = {
  branch: {
    revisions: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor?: string | null
        endCursor?: string | null
      }
      edges: Array<{
        cursor: string
        node: {
          id: string
          comment: string
          isDraft: boolean
          isHead: boolean
          isStart: boolean
          createdAt: string
          endpoints: Array<{ id: string; type: EndpointType }>
        }
      }>
    }
  }
}

export type CreateEndpointMutationVariables = Exact<{
  data: CreateEndpointInput
}>

export type CreateEndpointMutation = {
  createEndpoint: {
    id: string
    type: EndpointType
    createdAt: string
    revisionId: string
    revision: { id: string; isDraft: boolean; isHead: boolean; createdAt: string; branch: { id: string; name: string } }
  }
}

export type DeleteEndpointMutationVariables = Exact<{
  data: DeleteEndpointInput
}>

export type DeleteEndpointMutation = { deleteEndpoint: boolean }

export type LoginGithubMutationVariables = Exact<{
  data: LoginGithubInput
}>

export type LoginGithubMutation = { loginGithub: { accessToken: string } }

export type LoginGoogleMutationVariables = Exact<{
  data: LoginGoogleInput
}>

export type LoginGoogleMutation = { loginGoogle: { accessToken: string } }

export type LoginMutationVariables = Exact<{
  data: LoginInput
}>

export type LoginMutation = { login: { accessToken: string } }

export type MigrationBranchFragment = {
  id: string
  name: string
  isRoot: boolean
  head: { id: string }
  draft: { id: string }
}

export type GetMigrationBranchesQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type GetMigrationBranchesQuery = {
  branches: {
    totalCount: number
    edges: Array<{ node: { id: string; name: string; isRoot: boolean; head: { id: string }; draft: { id: string } } }>
  }
}

export type GetBranchMigrationsQueryVariables = Exact<{
  data: GetRevisionInput
}>

export type GetBranchMigrationsQuery = {
  revision: { id: string; migrations: Array<{ [key: string]: any } | string | number | boolean | null> }
}

export type ApplyMigrationsMutationVariables = Exact<{
  data: ApplyMigrationsInput
}>

export type ApplyMigrationsMutation = {
  applyMigrations: Array<{ id: string; status: ApplyMigrationStatus; error?: string | null }>
}

export type GetMigrationsQueryVariables = Exact<{
  data: GetRevisionInput
}>

export type GetMigrationsQuery = {
  revision: { id: string; migrations: Array<{ [key: string]: any } | string | number | boolean | null> }
}

export type UpdateProjectMutationVariables = Exact<{
  data: UpdateProjectInput
}>

export type UpdateProjectMutation = { updateProject: boolean }

export type DeleteProjectForSettingsMutationVariables = Exact<{
  data: DeleteProjectInput
}>

export type DeleteProjectForSettingsMutation = { deleteProject: boolean }

export type FetchTableForStackQueryVariables = Exact<{
  data: GetTableInput
}>

export type FetchTableForStackQuery = {
  table?: {
    id: string
    versionId: string
    readonly: boolean
    count: number
    schema: { [key: string]: any } | string | number | boolean | null
  } | null
}

export type TableStackFragmentFragment = {
  id: string
  versionId: string
  readonly: boolean
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type CreateTableForStackMutationVariables = Exact<{
  data: CreateTableInput
}>

export type CreateTableForStackMutation = {
  createTable: {
    table: {
      id: string
      versionId: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type UpdateTableForStackMutationVariables = Exact<{
  data: UpdateTableInput
}>

export type UpdateTableForStackMutation = {
  updateTable: {
    previousVersionTableId: string
    table: {
      id: string
      versionId: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type RenameTableForStackMutationVariables = Exact<{
  data: RenameTableInput
}>

export type RenameTableForStackMutation = {
  renameTable: {
    previousVersionTableId: string
    table: {
      id: string
      versionId: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type RowPageDataQueryVariables = Exact<{
  rowData: GetRowInput
  tableData: GetTableInput
  foreignKeysData: GetRowCountForeignKeysByInput
}>

export type RowPageDataQuery = {
  getRowCountForeignKeysTo: number
  row?: { id: string; data: { [key: string]: any } | string | number | boolean | null } | null
  table?: { id: string; schema: { [key: string]: any } | string | number | boolean | null } | null
}

export type SignUpMutationVariables = Exact<{
  data: SignUpInput
}>

export type SignUpMutation = { signUp: boolean }

export type SetUsernameMutationVariables = Exact<{
  data: SetUsernameInput
}>

export type SetUsernameMutation = { setUsername: boolean }

export type UserProjectItemFragment = {
  id: string
  user: { id: string; email?: string | null; username?: string | null }
  role: { id: string; name: string }
}

export type GetUsersProjectQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  first: Scalars['Int']['input']
  after?: InputMaybe<Scalars['String']['input']>
}>

export type GetUsersProjectQuery = {
  usersProject: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: {
        id: string
        user: { id: string; email?: string | null; username?: string | null }
        role: { id: string; name: string }
      }
    }>
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
  }
}

export type SearchUsersQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  after?: InputMaybe<Scalars['String']['input']>
}>

export type SearchUsersQuery = {
  searchUsers: {
    totalCount: number
    edges: Array<{ cursor: string; node: { id: string; email?: string | null; username?: string | null } }>
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
  }
}

export type AddUserToProjectMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  userId: Scalars['String']['input']
  roleId: UserProjectRoles
}>

export type AddUserToProjectMutation = { addUserToProject: boolean }

export type RemoveUserFromProjectMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  userId: Scalars['String']['input']
}>

export type RemoveUserFromProjectMutation = { removeUserFromProject: boolean }

export type UpdateUserProjectRoleMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
  userId: Scalars['String']['input']
  roleId: UserProjectRoles
}>

export type UpdateUserProjectRoleMutation = { updateUserProjectRole: boolean }

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']['input']
  password: Scalars['String']['input']
  email?: InputMaybe<Scalars['String']['input']>
  roleId: UserSystemRole
}>

export type CreateUserMutation = { createUser: boolean }

export type PageInfoFragment = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}

export type ConfigurationQueryVariables = Exact<{ [key: string]: never }>

export type ConfigurationQuery = {
  configuration: {
    availableEmailSignUp: boolean
    google: { available: boolean; clientId?: string | null }
    github: { available: boolean; clientId?: string | null }
    plugins: { file: boolean; formula: boolean }
  }
}

export type UserFragment = {
  id: string
  username?: string | null
  email?: string | null
  hasPassword: boolean
  organizationId?: string | null
  role?: {
    id: string
    name: string
    permissions: Array<{
      id: string
      action: string
      subject: string
      condition?: { [key: string]: any } | string | number | boolean | null | null
    }>
  } | null
}

export type GetMeQueryVariables = Exact<{ [key: string]: never }>

export type GetMeQuery = {
  me: {
    id: string
    username?: string | null
    email?: string | null
    hasPassword: boolean
    organizationId?: string | null
    role?: {
      id: string
      name: string
      permissions: Array<{
        id: string
        action: string
        subject: string
        condition?: { [key: string]: any } | string | number | boolean | null | null
      }>
    } | null
  }
}

export type RevisionMapRevisionBaseFragment = {
  id: string
  comment: string
  isDraft: boolean
  isHead: boolean
  isStart: boolean
  createdAt: string
  parent?: { id: string } | null
  endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  childBranches: Array<{ branch: { id: string; name: string } }>
}

export type RevisionMapBranchFullFragment = {
  id: string
  name: string
  isRoot: boolean
  touched: boolean
  createdAt: string
  head: {
    id: string
    comment: string
    isDraft: boolean
    isHead: boolean
    isStart: boolean
    createdAt: string
    parent?: { id: string } | null
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    childBranches: Array<{ branch: { id: string; name: string } }>
  }
  draft: {
    id: string
    comment: string
    isDraft: boolean
    isHead: boolean
    isStart: boolean
    createdAt: string
    parent?: { id: string } | null
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    childBranches: Array<{ branch: { id: string; name: string } }>
  }
  start: {
    id: string
    comment: string
    isDraft: boolean
    isHead: boolean
    isStart: boolean
    createdAt: string
    parent?: { id: string } | null
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    childBranches: Array<{ branch: { id: string; name: string } }>
  }
  parent?: {
    revision: {
      id: string
      comment: string
      isDraft: boolean
      isHead: boolean
      isStart: boolean
      createdAt: string
      parent?: { id: string } | null
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      childBranches: Array<{ branch: { id: string; name: string } }>
    }
    branch: { id: string; name: string }
  } | null
  revisions: { totalCount: number }
}

export type GetProjectGraphQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type GetProjectGraphQuery = {
  branches: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        name: string
        isRoot: boolean
        touched: boolean
        createdAt: string
        head: {
          id: string
          comment: string
          isDraft: boolean
          isHead: boolean
          isStart: boolean
          createdAt: string
          parent?: { id: string } | null
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          childBranches: Array<{ branch: { id: string; name: string } }>
        }
        draft: {
          id: string
          comment: string
          isDraft: boolean
          isHead: boolean
          isStart: boolean
          createdAt: string
          parent?: { id: string } | null
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          childBranches: Array<{ branch: { id: string; name: string } }>
        }
        start: {
          id: string
          comment: string
          isDraft: boolean
          isHead: boolean
          isStart: boolean
          createdAt: string
          parent?: { id: string } | null
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          childBranches: Array<{ branch: { id: string; name: string } }>
        }
        parent?: {
          revision: {
            id: string
            comment: string
            isDraft: boolean
            isHead: boolean
            isStart: boolean
            createdAt: string
            parent?: { id: string } | null
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
            childBranches: Array<{ branch: { id: string; name: string } }>
          }
          branch: { id: string; name: string }
        } | null
        revisions: { totalCount: number }
      }
    }>
  }
}

export type FindBranchFragment = {
  id: string
  name: string
  isRoot: boolean
  touched: boolean
  parent?: { revision: { branch: { id: string } } } | null
}

export type FindBranchesQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type FindBranchesQuery = {
  branches: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
    edges: Array<{
      cursor: string
      node: {
        id: string
        name: string
        isRoot: boolean
        touched: boolean
        parent?: { revision: { branch: { id: string } } } | null
      }
    }>
  }
}

export type FindRevisionFragment = {
  id: string
  comment: string
  isDraft: boolean
  isHead: boolean
  isStart: boolean
  createdAt: string
}

export type FindRevisionsQueryVariables = Exact<{
  data: GetBranchInput
  revisionsData: GetBranchRevisionsInput
}>

export type FindRevisionsQuery = {
  branch: {
    revisions: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor?: string | null
        endCursor?: string | null
      }
      edges: Array<{
        cursor: string
        node: { id: string; comment: string; isDraft: boolean; isHead: boolean; isStart: boolean; createdAt: string }
      }>
    }
  }
}

export type MeProjectListItemFragment = {
  id: string
  name: string
  organizationId: string
  rootBranch: { name: string; touched: boolean }
}

export type MeProjectsListQueryVariables = Exact<{
  data: GetMeProjectsInput
}>

export type MeProjectsListQuery = {
  meProjects: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
    edges: Array<{
      cursor: string
      node: { id: string; name: string; organizationId: string; rootBranch: { name: string; touched: boolean } }
    }>
  }
}

export type RowChangeRowFieldsFragment = { id: string }

export type RowChangeTableFieldsFragment = { id: string }

export type FieldChangeFieldsFragment = {
  fieldPath: string
  changeType: RowChangeDetailType
  oldValue?: { [key: string]: any } | string | number | boolean | null | null
  newValue?: { [key: string]: any } | string | number | boolean | null | null
  movedFrom?: string | null
}

export type GetRowChangesQueryVariables = Exact<{
  revisionId: Scalars['String']['input']
  first: Scalars['Int']['input']
  after?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<RowChangesFiltersInput>
}>

export type GetRowChangesQuery = {
  rowChanges: {
    totalCount: number
    edges: Array<{
      cursor: string
      node:
        | {
            changeType: ChangeType
            row: { id: string }
            table: { id: string }
            fieldChanges: Array<{
              fieldPath: string
              changeType: RowChangeDetailType
              oldValue?: { [key: string]: any } | string | number | boolean | null | null
              newValue?: { [key: string]: any } | string | number | boolean | null | null
              movedFrom?: string | null
            }>
          }
        | {
            changeType: ChangeType
            row: { id: string }
            fromRow: { id: string }
            table: { id: string }
            fromTable: { id: string }
            fieldChanges: Array<{
              fieldPath: string
              changeType: RowChangeDetailType
              oldValue?: { [key: string]: any } | string | number | boolean | null | null
              newValue?: { [key: string]: any } | string | number | boolean | null | null
              movedFrom?: string | null
            }>
          }
        | {
            changeType: ChangeType
            fromRow: { id: string }
            fromTable: { id: string }
            fieldChanges: Array<{
              fieldPath: string
              changeType: RowChangeDetailType
              oldValue?: { [key: string]: any } | string | number | boolean | null | null
              newValue?: { [key: string]: any } | string | number | boolean | null | null
              movedFrom?: string | null
            }>
          }
    }>
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string | null; endCursor?: string | null }
  }
}

export type GetTableChangesForFilterQueryVariables = Exact<{
  revisionId: Scalars['String']['input']
}>

export type GetTableChangesForFilterQuery = {
  tableChanges: {
    edges: Array<{
      node: {
        tableId: string
        changeType: ChangeType
        oldTableId?: string | null
        newTableId?: string | null
        rowChangesCount: number
      }
    }>
  }
}

export type RowListItemFragment = {
  id: string
  versionId: string
  readonly: boolean
  data: { [key: string]: any } | string | number | boolean | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdId: string
}

export type RowListRowsQueryVariables = Exact<{
  data: GetRowsInput
}>

export type RowListRowsQuery = {
  rows: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    edges: Array<{
      node: {
        id: string
        versionId: string
        readonly: boolean
        data: { [key: string]: any } | string | number | boolean | null
        createdAt: string
        updatedAt: string
        publishedAt: string
        createdId: string
      }
    }>
  }
}

export type DeleteRowMutationVariables = Exact<{
  data: DeleteRowInput
}>

export type DeleteRowMutation = { deleteRow: { branch: { id: string } } }

export type DeleteRowsMutationVariables = Exact<{
  data: DeleteRowsInput
}>

export type DeleteRowsMutation = { deleteRows: { branch: { id: string } } }

export type PatchRowInlineMutationVariables = Exact<{
  data: PatchRowInput
}>

export type PatchRowInlineMutation = {
  patchRow: {
    row: {
      id: string
      versionId: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
      createdAt: string
      updatedAt: string
      publishedAt: string
      createdId: string
    }
  }
}

export type TableViewsDataFragment = {
  version: number
  defaultViewId: string
  views: Array<{
    id: string
    name: string
    description?: string | null
    filters?: { [key: string]: any } | string | number | boolean | null | null
    search?: string | null
    columns?: Array<{ field: string; width?: number | null }> | null
    sorts?: Array<{ field: string; direction: string }> | null
  }>
}

export type GetTableViewsQueryVariables = Exact<{
  data: GetTableInput
}>

export type GetTableViewsQuery = {
  table?: {
    id: string
    views: {
      version: number
      defaultViewId: string
      views: Array<{
        id: string
        name: string
        description?: string | null
        filters?: { [key: string]: any } | string | number | boolean | null | null
        search?: string | null
        columns?: Array<{ field: string; width?: number | null }> | null
        sorts?: Array<{ field: string; direction: string }> | null
      }>
    }
  } | null
}

export type UpdateTableViewsMutationVariables = Exact<{
  data: UpdateTableViewsInput
}>

export type UpdateTableViewsMutation = {
  updateTableViews: {
    version: number
    defaultViewId: string
    views: Array<{
      id: string
      name: string
      description?: string | null
      filters?: { [key: string]: any } | string | number | boolean | null | null
      search?: string | null
      columns?: Array<{ field: string; width?: number | null }> | null
      sorts?: Array<{ field: string; direction: string }> | null
    }>
  }
}

export type ForeignKeyTableItemFragment = {
  id: string
  versionId: string
  createdId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type ForeignKeyRowItemFragment = {
  id: string
  versionId: string
  createdId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  data: { [key: string]: any } | string | number | boolean | null
}

export type ForeignKeyTableWithRowsQueryVariables = Exact<{
  tableData: GetTableInput
  rowsData: GetRowsInput
}>

export type ForeignKeyTableWithRowsQuery = {
  table?: {
    id: string
    versionId: string
    createdId: string
    createdAt: string
    updatedAt: string
    readonly: boolean
    count: number
    schema: { [key: string]: any } | string | number | boolean | null
  } | null
  rows: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    edges: Array<{
      node: {
        id: string
        versionId: string
        createdId: string
        createdAt: string
        updatedAt: string
        readonly: boolean
        data: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export type RowMutationItemFragment = {
  id: string
  versionId: string
  createdId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  data: { [key: string]: any } | string | number | boolean | null
}

export type TableMutationItemFragment = {
  id: string
  versionId: string
  createdId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type CreateRowForStackMutationVariables = Exact<{
  data: CreateRowInput
}>

export type CreateRowForStackMutation = {
  createRow: {
    previousVersionTableId: string
    table: {
      id: string
      versionId: string
      createdId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      id: string
      versionId: string
      createdId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type UpdateRowForStackMutationVariables = Exact<{
  data: UpdateRowInput
}>

export type UpdateRowForStackMutation = {
  updateRow: {
    previousVersionTableId: string
    previousVersionRowId: string
    table: {
      id: string
      versionId: string
      createdId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      id: string
      versionId: string
      createdId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type RenameRowForStackMutationVariables = Exact<{
  data: RenameRowInput
}>

export type RenameRowForStackMutation = {
  renameRow: {
    previousVersionTableId: string
    previousVersionRowId: string
    table: {
      id: string
      versionId: string
      createdId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      id: string
      versionId: string
      createdId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type SearchResultFragment = {
  row: { id: string }
  table: { id: string }
  matches: Array<{
    value: { [key: string]: any } | string | number | boolean | null
    path: string
    highlight?: string | null
  }>
}

export type SearchRowsQueryVariables = Exact<{
  data: SearchRowsInput
}>

export type SearchRowsQuery = {
  searchRows: {
    totalCount: number
    edges: Array<{
      cursor: string
      node: {
        row: { id: string }
        table: { id: string }
        matches: Array<{
          value: { [key: string]: any } | string | number | boolean | null
          path: string
          highlight?: string | null
        }>
      }
    }>
  }
}

export type RevertChangesForSidebarMutationVariables = Exact<{
  data: RevertChangesInput
}>

export type RevertChangesForSidebarMutation = { revertChanges: { id: string } }

export type CreateRevisionForSidebarMutationVariables = Exact<{
  data: CreateRevisionInput
}>

export type CreateRevisionForSidebarMutation = { createRevision: { id: string } }

export type CreateBranchForSidebarMutationVariables = Exact<{
  data: CreateBranchInput
}>

export type CreateBranchForSidebarMutation = { createBranch: { id: string } }

export type DeleteTableForListMutationVariables = Exact<{
  data: DeleteTableInput
}>

export type DeleteTableForListMutation = { deleteTable: { branch: { id: string } } }

export type TableListItemFragment = { id: string; versionId: string; readonly: boolean; count: number }

export type TableListDataQueryVariables = Exact<{
  data: GetTablesInput
}>

export type TableListDataQuery = {
  tables: {
    totalCount: number
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    edges: Array<{ node: { id: string; versionId: string; readonly: boolean; count: number } }>
  }
}

export type TableRelationsItemFragment = {
  id: string
  versionId: string
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type TableRelationsDataQueryVariables = Exact<{
  data: GetTablesInput
}>

export type TableRelationsDataQuery = {
  tables: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        versionId: string
        count: number
        schema: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export const BranchLoaderFragmentFragmentDoc = gql`
  fragment BranchLoaderFragment on BranchModel {
    id
    createdAt
    name
    touched
    projectId
    head {
      id
    }
    draft {
      id
    }
  }
`
export const BranchFragmentFragmentDoc = gql`
  fragment BranchFragment on BranchModel {
    id
    createdAt
    name
    touched
    projectId
    head {
      id
    }
    draft {
      id
    }
  }
`
export const ProjectLoaderFragmentFragmentDoc = gql`
  fragment ProjectLoaderFragment on ProjectModel {
    id
    organizationId
    createdAt
    name
    isPublic
    rootBranch {
      ...BranchFragment
    }
    userProject {
      id
      role {
        id
        name
        permissions {
          id
          action
          subject
          condition
        }
      }
    }
    organization {
      id
      userOrganization {
        id
        role {
          id
          name
          permissions {
            id
            action
            subject
            condition
          }
        }
      }
    }
  }
  ${BranchFragmentFragmentDoc}
`
export const RowLoaderFragmentFragmentDoc = gql`
  fragment RowLoaderFragment on RowModel {
    createdId
    id
    versionId
    createdAt
    updatedAt
    readonly
    data
  }
`
export const TableLoaderFragmentFragmentDoc = gql`
  fragment TableLoaderFragment on TableModel {
    createdId
    id
    versionId
    createdAt
    updatedAt
    readonly
    count
    schema
  }
`
export const AdminUserDetailFragmentDoc = gql`
  fragment AdminUserDetail on UserModel {
    id
    email
    username
    role {
      id
      name
    }
  }
`
export const AdminUserItemFragmentDoc = gql`
  fragment AdminUserItem on UserModel {
    id
    email
    username
    role {
      id
      name
    }
  }
`
export const AssetTableItemFragmentDoc = gql`
  fragment AssetTableItem on TableModel {
    id
    versionId
    count
    schema
  }
`
export const AssetRowItemFragmentDoc = gql`
  fragment AssetRowItem on RowModel {
    id
    versionId
    data
  }
`
export const SubSchemaItemFragmentDoc = gql`
  fragment SubSchemaItem on SubSchemaItemModel {
    table {
      id
      versionId
    }
    row {
      id
      versionId
      data
    }
    fieldPath
    data
  }
`
export const BranchItemFragmentDoc = gql`
  fragment BranchItem on BranchModel {
    id
    name
    isRoot
    touched
    createdAt
    start {
      id
      createdAt
    }
    parent {
      revision {
        id
        isDraft
        isHead
        createdAt
        branch {
          id
          name
        }
      }
    }
  }
`
export const RevisionForSelectFragmentDoc = gql`
  fragment RevisionForSelect on RevisionModel {
    id
    isDraft
    isHead
    createdAt
    comment
  }
`
export const EndpointFragmentDoc = gql`
  fragment Endpoint on EndpointModel {
    id
    type
    createdAt
    revisionId
    revision {
      id
      isDraft
      isHead
      createdAt
      branch {
        id
        name
      }
    }
  }
`
export const RevisionWithEndpointsFragmentDoc = gql`
  fragment RevisionWithEndpoints on RevisionModel {
    id
    comment
    isDraft
    isHead
    isStart
    createdAt
    endpoints {
      id
      type
    }
  }
`
export const EndpointBranchFragmentDoc = gql`
  fragment EndpointBranch on BranchModel {
    id
    name
    isRoot
    head {
      id
    }
    draft {
      id
    }
  }
`
export const MigrationBranchFragmentDoc = gql`
  fragment MigrationBranch on BranchModel {
    id
    name
    isRoot
    head {
      id
    }
    draft {
      id
    }
  }
`
export const TableStackFragmentFragmentDoc = gql`
  fragment TableStackFragment on TableModel {
    id
    versionId
    readonly
    count
    schema
  }
`
export const UserProjectItemFragmentDoc = gql`
  fragment UserProjectItem on UsersProjectModel {
    id
    user {
      id
      email
      username
    }
    role {
      id
      name
    }
  }
`
export const PageInfoFragmentDoc = gql`
  fragment PageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`
export const UserFragmentDoc = gql`
  fragment User on MeModel {
    id
    username
    email
    hasPassword
    organizationId
    role {
      id
      name
      permissions {
        id
        action
        subject
        condition
      }
    }
  }
`
export const RevisionMapRevisionBaseFragmentDoc = gql`
  fragment RevisionMapRevisionBase on RevisionModel {
    id
    comment
    isDraft
    isHead
    isStart
    createdAt
    parent {
      id
    }
    endpoints {
      id
      type
      createdAt
    }
    childBranches {
      branch {
        id
        name
      }
    }
  }
`
export const RevisionMapBranchFullFragmentDoc = gql`
  fragment RevisionMapBranchFull on BranchModel {
    id
    name
    isRoot
    touched
    createdAt
    head {
      ...RevisionMapRevisionBase
    }
    draft {
      ...RevisionMapRevisionBase
    }
    start {
      ...RevisionMapRevisionBase
    }
    parent {
      revision {
        ...RevisionMapRevisionBase
      }
      branch {
        id
        name
      }
    }
    revisions(data: { first: 1000 }) {
      totalCount
    }
  }
  ${RevisionMapRevisionBaseFragmentDoc}
`
export const FindBranchFragmentDoc = gql`
  fragment FindBranch on BranchModel {
    id
    name
    isRoot
    touched
    parent {
      revision {
        branch {
          id
        }
      }
    }
  }
`
export const FindRevisionFragmentDoc = gql`
  fragment FindRevision on RevisionModel {
    id
    comment
    isDraft
    isHead
    isStart
    createdAt
  }
`
export const MeProjectListItemFragmentDoc = gql`
  fragment MeProjectListItem on ProjectModel {
    id
    name
    organizationId
    rootBranch {
      name
      touched
    }
  }
`
export const RowChangeRowFieldsFragmentDoc = gql`
  fragment RowChangeRowFields on RowChangeRowModel {
    id
  }
`
export const RowChangeTableFieldsFragmentDoc = gql`
  fragment RowChangeTableFields on RowChangeTableModel {
    id
  }
`
export const FieldChangeFieldsFragmentDoc = gql`
  fragment FieldChangeFields on FieldChangeModel {
    fieldPath
    changeType
    oldValue
    newValue
    movedFrom
  }
`
export const RowListItemFragmentDoc = gql`
  fragment RowListItem on RowModel {
    id
    versionId
    readonly
    data
    createdAt
    updatedAt
    publishedAt
    createdId
  }
`
export const TableViewsDataFragmentDoc = gql`
  fragment TableViewsData on TableViewsDataModel {
    version
    defaultViewId
    views {
      id
      name
      description
      columns {
        field
        width
      }
      filters
      sorts {
        field
        direction
      }
      search
    }
  }
`
export const ForeignKeyTableItemFragmentDoc = gql`
  fragment ForeignKeyTableItem on TableModel {
    id
    versionId
    createdId
    createdAt
    updatedAt
    readonly
    count
    schema
  }
`
export const ForeignKeyRowItemFragmentDoc = gql`
  fragment ForeignKeyRowItem on RowModel {
    id
    versionId
    createdId
    createdAt
    updatedAt
    readonly
    data
  }
`
export const RowMutationItemFragmentDoc = gql`
  fragment RowMutationItem on RowModel {
    id
    versionId
    createdId
    createdAt
    updatedAt
    readonly
    data
  }
`
export const TableMutationItemFragmentDoc = gql`
  fragment TableMutationItem on TableModel {
    id
    versionId
    createdId
    createdAt
    updatedAt
    readonly
    count
    schema
  }
`
export const SearchResultFragmentDoc = gql`
  fragment SearchResult on SearchResult {
    row {
      id
    }
    table {
      id
    }
    matches {
      value
      path
      highlight
    }
  }
`
export const TableListItemFragmentDoc = gql`
  fragment TableListItem on TableModel {
    id
    versionId
    readonly
    count
  }
`
export const TableRelationsItemFragmentDoc = gql`
  fragment TableRelationsItem on TableModel {
    id
    versionId
    count
    schema
  }
`
export const GetBranchForLoaderDocument = gql`
  query getBranchForLoader($data: GetBranchInput!) {
    branch(data: $data) {
      ...BranchLoaderFragment
    }
  }
  ${BranchLoaderFragmentFragmentDoc}
`
export const GetProjectDocument = gql`
  query getProject($data: GetProjectInput!) {
    project(data: $data) {
      id
      organizationId
      createdAt
      name
      isPublic
      userProject {
        id
        role {
          id
          name
          permissions {
            id
            action
            subject
            condition
          }
        }
      }
      organization {
        id
        userOrganization {
          id
          role {
            id
            name
            permissions {
              id
              action
              subject
              condition
            }
          }
        }
      }
    }
  }
`
export const GetProjectForLoaderDocument = gql`
  query getProjectForLoader($data: GetProjectInput!) {
    project(data: $data) {
      ...ProjectLoaderFragment
    }
  }
  ${ProjectLoaderFragmentFragmentDoc}
`
export const GetRevisionForLoaderDocument = gql`
  query getRevisionForLoader($data: GetRevisionInput!) {
    revision(data: $data) {
      id
    }
  }
`
export const GetRowForLoaderDocument = gql`
  query getRowForLoader($data: GetRowInput!) {
    row(data: $data) {
      ...RowLoaderFragment
    }
  }
  ${RowLoaderFragmentFragmentDoc}
`
export const GetRowCountForeignKeysToForLoaderDocument = gql`
  query getRowCountForeignKeysToForLoader($data: GetRowInput!) {
    row(data: $data) {
      id
      countForeignKeysTo
    }
  }
`
export const ForeignKeysByDocument = gql`
  query ForeignKeysBy($tableData: GetTableInput!, $foreignKeyTablesData: GetTableForeignKeysInput!) {
    table(data: $tableData) {
      id
      foreignKeysBy(data: $foreignKeyTablesData) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
          }
        }
      }
    }
  }
`
export const ForeignKeysByRowsDocument = gql`
  query ForeignKeysByRows($rowData: GetRowInput!, $foreignKeyRowsData: GetRowForeignKeysInput!) {
    row(data: $rowData) {
      id
      rowForeignKeysBy(data: $foreignKeyRowsData) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            versionId
            data
          }
        }
      }
    }
  }
`
export const GetTableForLoaderDocument = gql`
  query getTableForLoader($data: GetTableInput!) {
    table(data: $data) {
      ...TableLoaderFragment
    }
  }
  ${TableLoaderFragmentFragmentDoc}
`
export const UpdatePasswordDocument = gql`
  mutation updatePassword($data: UpdatePasswordInput!) {
    updatePassword(data: $data)
  }
`
export const CreateProjectDocument = gql`
  mutation createProject($data: CreateProjectInput!) {
    createProject(data: $data) {
      id
      name
      organizationId
    }
  }
`
export const FindForeignKeyDocument = gql`
  query findForeignKey($data: GetRowsInput!) {
    rows(data: $data) {
      totalCount
      pageInfo {
        ...PageInfo
      }
      edges {
        cursor
        node {
          id
        }
      }
    }
  }
  ${PageInfoFragmentDoc}
`
export const AdminDashboardStatsDocument = gql`
  query AdminDashboardStats($first: Int!) {
    searchUsers(data: { first: $first }) {
      totalCount
    }
  }
`
export const AdminGetUserDocument = gql`
  query adminGetUser($userId: String!) {
    adminUser(data: { userId: $userId }) {
      ...AdminUserDetail
    }
  }
  ${AdminUserDetailFragmentDoc}
`
export const AdminResetPasswordDocument = gql`
  mutation adminResetPassword($userId: String!, $newPassword: String!) {
    resetPassword(data: { userId: $userId, newPassword: $newPassword })
  }
`
export const AdminUsersDocument = gql`
  query adminUsers($search: String, $first: Int!, $after: String) {
    adminUsers(data: { search: $search, first: $first, after: $after }) {
      edges {
        node {
          ...AdminUserItem
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${AdminUserItemFragmentDoc}
`
export const AdminUserDocument = gql`
  query adminUser($userId: String!) {
    adminUser(data: { userId: $userId }) {
      ...AdminUserItem
    }
  }
  ${AdminUserItemFragmentDoc}
`
export const AssetsTablesDataDocument = gql`
  query assetsTablesData($data: GetTablesInput!) {
    tables(data: $data) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...AssetTableItem
        }
      }
    }
  }
  ${AssetTableItemFragmentDoc}
`
export const AssetsRowsDataDocument = gql`
  query assetsRowsData($data: GetRowsInput!) {
    rows(data: $data) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...AssetRowItem
        }
      }
    }
  }
  ${AssetRowItemFragmentDoc}
`
export const SubSchemaItemsDataDocument = gql`
  query subSchemaItemsData($data: GetSubSchemaItemsInput!) {
    subSchemaItems(data: $data) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...SubSchemaItem
        }
      }
    }
  }
  ${SubSchemaItemFragmentDoc}
`
export const GetProjectBranchesDocument = gql`
  query getProjectBranches($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      pageInfo {
        ...PageInfo
      }
      edges {
        cursor
        node {
          ...BranchItem
        }
      }
    }
  }
  ${PageInfoFragmentDoc}
  ${BranchItemFragmentDoc}
`
export const DeleteBranchDocument = gql`
  mutation deleteBranch($data: DeleteBranchInput!) {
    deleteBranch(data: $data)
  }
`
export const GetBranchesForSelectDocument = gql`
  query getBranchesForSelect($data: GetBranchesInput!) {
    branches(data: $data) {
      edges {
        node {
          id
          name
          isRoot
        }
      }
    }
  }
`
export const GetBranchRevisionsForCreateDocument = gql`
  query getBranchRevisionsForCreate($data: GetBranchInput!, $revisionsData: GetBranchRevisionsInput!) {
    branch(data: $data) {
      id
      revisions(data: $revisionsData) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...RevisionForSelect
          }
        }
      }
    }
  }
  ${RevisionForSelectFragmentDoc}
`
export const CreateBranchDocument = gql`
  mutation createBranch($data: CreateBranchInput!) {
    createBranch(data: $data) {
      id
      name
    }
  }
`
export const GetRevisionChangesDocument = gql`
  query GetRevisionChanges($revisionId: String!, $compareWithRevisionId: String, $includeSystem: Boolean) {
    revisionChanges(
      data: { revisionId: $revisionId, compareWithRevisionId: $compareWithRevisionId, includeSystem: $includeSystem }
    ) {
      revisionId
      parentRevisionId
      totalChanges
      tablesSummary {
        added
        modified
        removed
        renamed
        total
      }
      rowsSummary {
        added
        modified
        removed
        renamed
        total
      }
    }
  }
`
export const GetTableChangesDocument = gql`
  query GetTableChanges($revisionId: String!, $first: Int!, $after: String, $filters: TableChangesFiltersInput) {
    tableChanges(data: { revisionId: $revisionId, first: $first, after: $after, filters: $filters }) {
      edges {
        node {
          tableId
          changeType
          oldTableId
          newTableId
          schemaMigrations {
            migrationType
            migrationId
            oldTableId
            newTableId
            patches {
              op
              path
              value
              from
            }
          }
          viewsChanges {
            hasChanges
            changes {
              viewId
              viewName
              changeType
              oldViewName
            }
            addedCount
            modifiedCount
            removedCount
            renamedCount
          }
          rowChangesCount
          addedRowsCount
          modifiedRowsCount
          removedRowsCount
          renamedRowsCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`
export const ConfirmEmailCodeDocument = gql`
  mutation confirmEmailCode($data: ConfirmEmailCodeInput!) {
    confirmEmailCode(data: $data) {
      accessToken
    }
  }
`
export const GetEndpointBranchesDocument = gql`
  query getEndpointBranches($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      edges {
        node {
          ...EndpointBranch
        }
      }
    }
  }
  ${EndpointBranchFragmentDoc}
`
export const GetProjectEndpointsDocument = gql`
  query getProjectEndpoints(
    $organizationId: String!
    $projectName: String!
    $first: Int!
    $after: String
    $branchId: String
    $type: EndpointType
  ) {
    projectEndpoints(
      data: {
        organizationId: $organizationId
        projectName: $projectName
        first: $first
        after: $after
        branchId: $branchId
        type: $type
      }
    ) {
      edges {
        node {
          ...Endpoint
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${EndpointFragmentDoc}
`
export const GetBranchRevisionsDocument = gql`
  query getBranchRevisions($data: GetBranchInput!, $revisionsData: GetBranchRevisionsInput!) {
    branch(data: $data) {
      revisions(data: $revisionsData) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...RevisionWithEndpoints
          }
        }
      }
    }
  }
  ${RevisionWithEndpointsFragmentDoc}
`
export const CreateEndpointDocument = gql`
  mutation createEndpoint($data: CreateEndpointInput!) {
    createEndpoint(data: $data) {
      ...Endpoint
    }
  }
  ${EndpointFragmentDoc}
`
export const DeleteEndpointDocument = gql`
  mutation deleteEndpoint($data: DeleteEndpointInput!) {
    deleteEndpoint(data: $data)
  }
`
export const LoginGithubDocument = gql`
  mutation loginGithub($data: LoginGithubInput!) {
    loginGithub(data: $data) {
      accessToken
    }
  }
`
export const LoginGoogleDocument = gql`
  mutation loginGoogle($data: LoginGoogleInput!) {
    loginGoogle(data: $data) {
      accessToken
    }
  }
`
export const LoginDocument = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      accessToken
    }
  }
`
export const GetMigrationBranchesDocument = gql`
  query getMigrationBranches($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      edges {
        node {
          ...MigrationBranch
        }
      }
    }
  }
  ${MigrationBranchFragmentDoc}
`
export const GetBranchMigrationsDocument = gql`
  query getBranchMigrations($data: GetRevisionInput!) {
    revision(data: $data) {
      id
      migrations
    }
  }
`
export const ApplyMigrationsDocument = gql`
  mutation applyMigrations($data: ApplyMigrationsInput!) {
    applyMigrations(data: $data) {
      id
      status
      error
    }
  }
`
export const GetMigrationsDocument = gql`
  query getMigrations($data: GetRevisionInput!) {
    revision(data: $data) {
      id
      migrations
    }
  }
`
export const UpdateProjectDocument = gql`
  mutation updateProject($data: UpdateProjectInput!) {
    updateProject(data: $data)
  }
`
export const DeleteProjectForSettingsDocument = gql`
  mutation deleteProjectForSettings($data: DeleteProjectInput!) {
    deleteProject(data: $data)
  }
`
export const FetchTableForStackDocument = gql`
  query fetchTableForStack($data: GetTableInput!) {
    table(data: $data) {
      ...TableStackFragment
    }
  }
  ${TableStackFragmentFragmentDoc}
`
export const CreateTableForStackDocument = gql`
  mutation createTableForStack($data: CreateTableInput!) {
    createTable(data: $data) {
      table {
        ...TableStackFragment
      }
    }
  }
  ${TableStackFragmentFragmentDoc}
`
export const UpdateTableForStackDocument = gql`
  mutation updateTableForStack($data: UpdateTableInput!) {
    updateTable(data: $data) {
      table {
        ...TableStackFragment
      }
      previousVersionTableId
    }
  }
  ${TableStackFragmentFragmentDoc}
`
export const RenameTableForStackDocument = gql`
  mutation renameTableForStack($data: RenameTableInput!) {
    renameTable(data: $data) {
      table {
        ...TableStackFragment
      }
      previousVersionTableId
    }
  }
  ${TableStackFragmentFragmentDoc}
`
export const RowPageDataDocument = gql`
  query rowPageData(
    $rowData: GetRowInput!
    $tableData: GetTableInput!
    $foreignKeysData: GetRowCountForeignKeysByInput!
  ) {
    row(data: $rowData) {
      id
      data
    }
    table(data: $tableData) {
      id
      schema
    }
    getRowCountForeignKeysTo(data: $foreignKeysData)
  }
`
export const SignUpDocument = gql`
  mutation signUp($data: SignUpInput!) {
    signUp(data: $data)
  }
`
export const SetUsernameDocument = gql`
  mutation setUsername($data: SetUsernameInput!) {
    setUsername(data: $data)
  }
`
export const GetUsersProjectDocument = gql`
  query getUsersProject($organizationId: String!, $projectName: String!, $first: Int!, $after: String) {
    usersProject(data: { organizationId: $organizationId, projectName: $projectName, first: $first, after: $after }) {
      edges {
        node {
          ...UserProjectItem
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${UserProjectItemFragmentDoc}
`
export const SearchUsersDocument = gql`
  query searchUsers($search: String, $first: Int!, $after: String) {
    searchUsers(data: { search: $search, first: $first, after: $after }) {
      edges {
        node {
          id
          email
          username
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`
export const AddUserToProjectDocument = gql`
  mutation addUserToProject(
    $organizationId: String!
    $projectName: String!
    $userId: String!
    $roleId: UserProjectRoles!
  ) {
    addUserToProject(
      data: { organizationId: $organizationId, projectName: $projectName, userId: $userId, roleId: $roleId }
    )
  }
`
export const RemoveUserFromProjectDocument = gql`
  mutation removeUserFromProject($organizationId: String!, $projectName: String!, $userId: String!) {
    removeUserFromProject(data: { organizationId: $organizationId, projectName: $projectName, userId: $userId })
  }
`
export const UpdateUserProjectRoleDocument = gql`
  mutation updateUserProjectRole(
    $organizationId: String!
    $projectName: String!
    $userId: String!
    $roleId: UserProjectRoles!
  ) {
    updateUserProjectRole(
      data: { organizationId: $organizationId, projectName: $projectName, userId: $userId, roleId: $roleId }
    )
  }
`
export const CreateUserDocument = gql`
  mutation createUser($username: String!, $password: String!, $email: String, $roleId: UserSystemRole!) {
    createUser(data: { username: $username, password: $password, email: $email, roleId: $roleId })
  }
`
export const ConfigurationDocument = gql`
  query configuration {
    configuration {
      availableEmailSignUp
      google {
        available
        clientId
      }
      github {
        available
        clientId
      }
      plugins {
        file
        formula
      }
    }
  }
`
export const GetMeDocument = gql`
  query getMe {
    me {
      ...User
    }
  }
  ${UserFragmentDoc}
`
export const GetProjectGraphDocument = gql`
  query getProjectGraph($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      edges {
        node {
          ...RevisionMapBranchFull
        }
      }
    }
  }
  ${RevisionMapBranchFullFragmentDoc}
`
export const FindBranchesDocument = gql`
  query findBranches($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      pageInfo {
        ...PageInfo
      }
      edges {
        cursor
        node {
          ...FindBranch
        }
      }
    }
  }
  ${PageInfoFragmentDoc}
  ${FindBranchFragmentDoc}
`
export const FindRevisionsDocument = gql`
  query findRevisions($data: GetBranchInput!, $revisionsData: GetBranchRevisionsInput!) {
    branch(data: $data) {
      revisions(data: $revisionsData) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...FindRevision
          }
        }
      }
    }
  }
  ${FindRevisionFragmentDoc}
`
export const MeProjectsListDocument = gql`
  query meProjectsList($data: GetMeProjectsInput!) {
    meProjects(data: $data) {
      totalCount
      pageInfo {
        ...PageInfo
      }
      edges {
        cursor
        node {
          ...MeProjectListItem
        }
      }
    }
  }
  ${PageInfoFragmentDoc}
  ${MeProjectListItemFragmentDoc}
`
export const GetRowChangesDocument = gql`
  query GetRowChanges($revisionId: String!, $first: Int!, $after: String, $filters: RowChangesFiltersInput) {
    rowChanges(data: { revisionId: $revisionId, first: $first, after: $after, filters: $filters }) {
      edges {
        node {
          ... on AddedRowChangeModel {
            changeType
            row {
              ...RowChangeRowFields
            }
            table {
              ...RowChangeTableFields
            }
            fieldChanges {
              ...FieldChangeFields
            }
          }
          ... on RemovedRowChangeModel {
            changeType
            fromRow {
              ...RowChangeRowFields
            }
            fromTable {
              ...RowChangeTableFields
            }
            fieldChanges {
              ...FieldChangeFields
            }
          }
          ... on ModifiedRowChangeModel {
            changeType
            row {
              ...RowChangeRowFields
            }
            fromRow {
              ...RowChangeRowFields
            }
            table {
              ...RowChangeTableFields
            }
            fromTable {
              ...RowChangeTableFields
            }
            fieldChanges {
              ...FieldChangeFields
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${RowChangeRowFieldsFragmentDoc}
  ${RowChangeTableFieldsFragmentDoc}
  ${FieldChangeFieldsFragmentDoc}
`
export const GetTableChangesForFilterDocument = gql`
  query GetTableChangesForFilter($revisionId: String!) {
    tableChanges(data: { revisionId: $revisionId, first: 1000, filters: { includeSystem: true } }) {
      edges {
        node {
          tableId
          changeType
          oldTableId
          newTableId
          rowChangesCount
        }
      }
    }
  }
`
export const RowListRowsDocument = gql`
  query RowListRows($data: GetRowsInput!) {
    rows(data: $data) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...RowListItem
        }
      }
    }
  }
  ${RowListItemFragmentDoc}
`
export const DeleteRowDocument = gql`
  mutation DeleteRow($data: DeleteRowInput!) {
    deleteRow(data: $data) {
      branch {
        id
      }
    }
  }
`
export const DeleteRowsDocument = gql`
  mutation DeleteRows($data: DeleteRowsInput!) {
    deleteRows(data: $data) {
      branch {
        id
      }
    }
  }
`
export const PatchRowInlineDocument = gql`
  mutation PatchRowInline($data: PatchRowInput!) {
    patchRow(data: $data) {
      row {
        ...RowListItem
      }
    }
  }
  ${RowListItemFragmentDoc}
`
export const GetTableViewsDocument = gql`
  query GetTableViews($data: GetTableInput!) {
    table(data: $data) {
      id
      views {
        ...TableViewsData
      }
    }
  }
  ${TableViewsDataFragmentDoc}
`
export const UpdateTableViewsDocument = gql`
  mutation UpdateTableViews($data: UpdateTableViewsInput!) {
    updateTableViews(data: $data) {
      ...TableViewsData
    }
  }
  ${TableViewsDataFragmentDoc}
`
export const ForeignKeyTableWithRowsDocument = gql`
  query foreignKeyTableWithRows($tableData: GetTableInput!, $rowsData: GetRowsInput!) {
    table(data: $tableData) {
      ...ForeignKeyTableItem
    }
    rows(data: $rowsData) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ForeignKeyRowItem
        }
      }
    }
  }
  ${ForeignKeyTableItemFragmentDoc}
  ${ForeignKeyRowItemFragmentDoc}
`
export const CreateRowForStackDocument = gql`
  mutation createRowForStack($data: CreateRowInput!) {
    createRow(data: $data) {
      table {
        ...TableMutationItem
      }
      previousVersionTableId
      row {
        ...RowMutationItem
      }
    }
  }
  ${TableMutationItemFragmentDoc}
  ${RowMutationItemFragmentDoc}
`
export const UpdateRowForStackDocument = gql`
  mutation updateRowForStack($data: UpdateRowInput!) {
    updateRow(data: $data) {
      table {
        ...TableMutationItem
      }
      previousVersionTableId
      row {
        ...RowMutationItem
      }
      previousVersionRowId
    }
  }
  ${TableMutationItemFragmentDoc}
  ${RowMutationItemFragmentDoc}
`
export const RenameRowForStackDocument = gql`
  mutation renameRowForStack($data: RenameRowInput!) {
    renameRow(data: $data) {
      table {
        ...TableMutationItem
      }
      previousVersionTableId
      row {
        ...RowMutationItem
      }
      previousVersionRowId
    }
  }
  ${TableMutationItemFragmentDoc}
  ${RowMutationItemFragmentDoc}
`
export const SearchRowsDocument = gql`
  query searchRows($data: SearchRowsInput!) {
    searchRows(data: $data) {
      edges {
        cursor
        node {
          ...SearchResult
        }
      }
      totalCount
    }
  }
  ${SearchResultFragmentDoc}
`
export const RevertChangesForSidebarDocument = gql`
  mutation revertChangesForSidebar($data: RevertChangesInput!) {
    revertChanges(data: $data) {
      id
    }
  }
`
export const CreateRevisionForSidebarDocument = gql`
  mutation createRevisionForSidebar($data: CreateRevisionInput!) {
    createRevision(data: $data) {
      id
    }
  }
`
export const CreateBranchForSidebarDocument = gql`
  mutation createBranchForSidebar($data: CreateBranchInput!) {
    createBranch(data: $data) {
      id
    }
  }
`
export const DeleteTableForListDocument = gql`
  mutation deleteTableForList($data: DeleteTableInput!) {
    deleteTable(data: $data) {
      branch {
        id
      }
    }
  }
`
export const TableListDataDocument = gql`
  query tableListData($data: GetTablesInput!) {
    tables(data: $data) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...TableListItem
        }
      }
    }
  }
  ${TableListItemFragmentDoc}
`
export const TableRelationsDataDocument = gql`
  query tableRelationsData($data: GetTablesInput!) {
    tables(data: $data) {
      totalCount
      edges {
        node {
          ...TableRelationsItem
        }
      }
    }
  }
  ${TableRelationsItemFragmentDoc}
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action()

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getBranchForLoader(
      variables: GetBranchForLoaderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetBranchForLoaderQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBranchForLoaderQuery>(GetBranchForLoaderDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getBranchForLoader',
        'query',
        variables,
      )
    },
    getProject(
      variables: GetProjectQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetProjectQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProjectQuery>(GetProjectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProject',
        'query',
        variables,
      )
    },
    getProjectForLoader(
      variables: GetProjectForLoaderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetProjectForLoaderQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProjectForLoaderQuery>(GetProjectForLoaderDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProjectForLoader',
        'query',
        variables,
      )
    },
    getRevisionForLoader(
      variables: GetRevisionForLoaderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetRevisionForLoaderQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetRevisionForLoaderQuery>(GetRevisionForLoaderDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRevisionForLoader',
        'query',
        variables,
      )
    },
    getRowForLoader(
      variables: GetRowForLoaderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetRowForLoaderQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetRowForLoaderQuery>(GetRowForLoaderDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRowForLoader',
        'query',
        variables,
      )
    },
    getRowCountForeignKeysToForLoader(
      variables: GetRowCountForeignKeysToForLoaderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetRowCountForeignKeysToForLoaderQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetRowCountForeignKeysToForLoaderQuery>(GetRowCountForeignKeysToForLoaderDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRowCountForeignKeysToForLoader',
        'query',
        variables,
      )
    },
    ForeignKeysBy(
      variables: ForeignKeysByQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ForeignKeysByQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ForeignKeysByQuery>(ForeignKeysByDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'ForeignKeysBy',
        'query',
        variables,
      )
    },
    ForeignKeysByRows(
      variables: ForeignKeysByRowsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ForeignKeysByRowsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ForeignKeysByRowsQuery>(ForeignKeysByRowsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'ForeignKeysByRows',
        'query',
        variables,
      )
    },
    getTableForLoader(
      variables: GetTableForLoaderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetTableForLoaderQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetTableForLoaderQuery>(GetTableForLoaderDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getTableForLoader',
        'query',
        variables,
      )
    },
    updatePassword(
      variables: UpdatePasswordMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdatePasswordMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdatePasswordMutation>(UpdatePasswordDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updatePassword',
        'mutation',
        variables,
      )
    },
    createProject(
      variables: CreateProjectMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateProjectMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateProjectMutation>(CreateProjectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createProject',
        'mutation',
        variables,
      )
    },
    findForeignKey(
      variables: FindForeignKeyQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<FindForeignKeyQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindForeignKeyQuery>(FindForeignKeyDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'findForeignKey',
        'query',
        variables,
      )
    },
    AdminDashboardStats(
      variables: AdminDashboardStatsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AdminDashboardStatsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AdminDashboardStatsQuery>(AdminDashboardStatsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'AdminDashboardStats',
        'query',
        variables,
      )
    },
    adminGetUser(
      variables: AdminGetUserQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AdminGetUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AdminGetUserQuery>(AdminGetUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'adminGetUser',
        'query',
        variables,
      )
    },
    adminResetPassword(
      variables: AdminResetPasswordMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AdminResetPasswordMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AdminResetPasswordMutation>(AdminResetPasswordDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'adminResetPassword',
        'mutation',
        variables,
      )
    },
    adminUsers(
      variables: AdminUsersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AdminUsersQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AdminUsersQuery>(AdminUsersDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'adminUsers',
        'query',
        variables,
      )
    },
    adminUser(
      variables: AdminUserQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AdminUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AdminUserQuery>(AdminUserDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'adminUser',
        'query',
        variables,
      )
    },
    assetsTablesData(
      variables: AssetsTablesDataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AssetsTablesDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AssetsTablesDataQuery>(AssetsTablesDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'assetsTablesData',
        'query',
        variables,
      )
    },
    assetsRowsData(
      variables: AssetsRowsDataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AssetsRowsDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AssetsRowsDataQuery>(AssetsRowsDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'assetsRowsData',
        'query',
        variables,
      )
    },
    subSchemaItemsData(
      variables: SubSchemaItemsDataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<SubSchemaItemsDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SubSchemaItemsDataQuery>(SubSchemaItemsDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'subSchemaItemsData',
        'query',
        variables,
      )
    },
    getProjectBranches(
      variables: GetProjectBranchesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetProjectBranchesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProjectBranchesQuery>(GetProjectBranchesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProjectBranches',
        'query',
        variables,
      )
    },
    deleteBranch(
      variables: DeleteBranchMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteBranchMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteBranchMutation>(DeleteBranchDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteBranch',
        'mutation',
        variables,
      )
    },
    getBranchesForSelect(
      variables: GetBranchesForSelectQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetBranchesForSelectQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBranchesForSelectQuery>(GetBranchesForSelectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getBranchesForSelect',
        'query',
        variables,
      )
    },
    getBranchRevisionsForCreate(
      variables: GetBranchRevisionsForCreateQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetBranchRevisionsForCreateQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBranchRevisionsForCreateQuery>(GetBranchRevisionsForCreateDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getBranchRevisionsForCreate',
        'query',
        variables,
      )
    },
    createBranch(
      variables: CreateBranchMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateBranchMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateBranchMutation>(CreateBranchDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createBranch',
        'mutation',
        variables,
      )
    },
    GetRevisionChanges(
      variables: GetRevisionChangesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetRevisionChangesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetRevisionChangesQuery>(GetRevisionChangesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetRevisionChanges',
        'query',
        variables,
      )
    },
    GetTableChanges(
      variables: GetTableChangesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetTableChangesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetTableChangesQuery>(GetTableChangesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetTableChanges',
        'query',
        variables,
      )
    },
    confirmEmailCode(
      variables: ConfirmEmailCodeMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ConfirmEmailCodeMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ConfirmEmailCodeMutation>(ConfirmEmailCodeDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'confirmEmailCode',
        'mutation',
        variables,
      )
    },
    getEndpointBranches(
      variables: GetEndpointBranchesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetEndpointBranchesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetEndpointBranchesQuery>(GetEndpointBranchesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getEndpointBranches',
        'query',
        variables,
      )
    },
    getProjectEndpoints(
      variables: GetProjectEndpointsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetProjectEndpointsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProjectEndpointsQuery>(GetProjectEndpointsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProjectEndpoints',
        'query',
        variables,
      )
    },
    getBranchRevisions(
      variables: GetBranchRevisionsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetBranchRevisionsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBranchRevisionsQuery>(GetBranchRevisionsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getBranchRevisions',
        'query',
        variables,
      )
    },
    createEndpoint(
      variables: CreateEndpointMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateEndpointMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateEndpointMutation>(CreateEndpointDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createEndpoint',
        'mutation',
        variables,
      )
    },
    deleteEndpoint(
      variables: DeleteEndpointMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteEndpointMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteEndpointMutation>(DeleteEndpointDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteEndpoint',
        'mutation',
        variables,
      )
    },
    loginGithub(
      variables: LoginGithubMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<LoginGithubMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginGithubMutation>(LoginGithubDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'loginGithub',
        'mutation',
        variables,
      )
    },
    loginGoogle(
      variables: LoginGoogleMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<LoginGoogleMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginGoogleMutation>(LoginGoogleDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'loginGoogle',
        'mutation',
        variables,
      )
    },
    login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginMutation>(LoginDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'login',
        'mutation',
        variables,
      )
    },
    getMigrationBranches(
      variables: GetMigrationBranchesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetMigrationBranchesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMigrationBranchesQuery>(GetMigrationBranchesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getMigrationBranches',
        'query',
        variables,
      )
    },
    getBranchMigrations(
      variables: GetBranchMigrationsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetBranchMigrationsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBranchMigrationsQuery>(GetBranchMigrationsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getBranchMigrations',
        'query',
        variables,
      )
    },
    applyMigrations(
      variables: ApplyMigrationsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ApplyMigrationsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ApplyMigrationsMutation>(ApplyMigrationsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'applyMigrations',
        'mutation',
        variables,
      )
    },
    getMigrations(
      variables: GetMigrationsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetMigrationsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMigrationsQuery>(GetMigrationsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getMigrations',
        'query',
        variables,
      )
    },
    updateProject(
      variables: UpdateProjectMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateProjectMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateProjectMutation>(UpdateProjectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updateProject',
        'mutation',
        variables,
      )
    },
    deleteProjectForSettings(
      variables: DeleteProjectForSettingsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteProjectForSettingsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteProjectForSettingsMutation>(DeleteProjectForSettingsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteProjectForSettings',
        'mutation',
        variables,
      )
    },
    fetchTableForStack(
      variables: FetchTableForStackQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<FetchTableForStackQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FetchTableForStackQuery>(FetchTableForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'fetchTableForStack',
        'query',
        variables,
      )
    },
    createTableForStack(
      variables: CreateTableForStackMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateTableForStackMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateTableForStackMutation>(CreateTableForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createTableForStack',
        'mutation',
        variables,
      )
    },
    updateTableForStack(
      variables: UpdateTableForStackMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateTableForStackMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateTableForStackMutation>(UpdateTableForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updateTableForStack',
        'mutation',
        variables,
      )
    },
    renameTableForStack(
      variables: RenameTableForStackMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RenameTableForStackMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RenameTableForStackMutation>(RenameTableForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'renameTableForStack',
        'mutation',
        variables,
      )
    },
    rowPageData(
      variables: RowPageDataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RowPageDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RowPageDataQuery>(RowPageDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'rowPageData',
        'query',
        variables,
      )
    },
    signUp(variables: SignUpMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SignUpMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SignUpMutation>(SignUpDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'signUp',
        'mutation',
        variables,
      )
    },
    setUsername(
      variables: SetUsernameMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<SetUsernameMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SetUsernameMutation>(SetUsernameDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'setUsername',
        'mutation',
        variables,
      )
    },
    getUsersProject(
      variables: GetUsersProjectQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetUsersProjectQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetUsersProjectQuery>(GetUsersProjectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getUsersProject',
        'query',
        variables,
      )
    },
    searchUsers(
      variables: SearchUsersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<SearchUsersQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SearchUsersQuery>(SearchUsersDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'searchUsers',
        'query',
        variables,
      )
    },
    addUserToProject(
      variables: AddUserToProjectMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AddUserToProjectMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddUserToProjectMutation>(AddUserToProjectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'addUserToProject',
        'mutation',
        variables,
      )
    },
    removeUserFromProject(
      variables: RemoveUserFromProjectMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RemoveUserFromProjectMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RemoveUserFromProjectMutation>(RemoveUserFromProjectDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'removeUserFromProject',
        'mutation',
        variables,
      )
    },
    updateUserProjectRole(
      variables: UpdateUserProjectRoleMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateUserProjectRoleMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateUserProjectRoleMutation>(UpdateUserProjectRoleDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updateUserProjectRole',
        'mutation',
        variables,
      )
    },
    createUser(
      variables: CreateUserMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateUserMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateUserMutation>(CreateUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createUser',
        'mutation',
        variables,
      )
    },
    configuration(
      variables?: ConfigurationQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ConfigurationQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ConfigurationQuery>(ConfigurationDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'configuration',
        'query',
        variables,
      )
    },
    getMe(variables?: GetMeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetMeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMeQuery>(GetMeDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'getMe',
        'query',
        variables,
      )
    },
    getProjectGraph(
      variables: GetProjectGraphQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetProjectGraphQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProjectGraphQuery>(GetProjectGraphDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProjectGraph',
        'query',
        variables,
      )
    },
    findBranches(
      variables: FindBranchesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<FindBranchesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindBranchesQuery>(FindBranchesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'findBranches',
        'query',
        variables,
      )
    },
    findRevisions(
      variables: FindRevisionsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<FindRevisionsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindRevisionsQuery>(FindRevisionsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'findRevisions',
        'query',
        variables,
      )
    },
    meProjectsList(
      variables: MeProjectsListQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<MeProjectsListQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<MeProjectsListQuery>(MeProjectsListDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'meProjectsList',
        'query',
        variables,
      )
    },
    GetRowChanges(
      variables: GetRowChangesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetRowChangesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetRowChangesQuery>(GetRowChangesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetRowChanges',
        'query',
        variables,
      )
    },
    GetTableChangesForFilter(
      variables: GetTableChangesForFilterQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetTableChangesForFilterQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetTableChangesForFilterQuery>(GetTableChangesForFilterDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetTableChangesForFilter',
        'query',
        variables,
      )
    },
    RowListRows(
      variables: RowListRowsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RowListRowsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RowListRowsQuery>(RowListRowsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RowListRows',
        'query',
        variables,
      )
    },
    DeleteRow(
      variables: DeleteRowMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteRowMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteRowMutation>(DeleteRowDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteRow',
        'mutation',
        variables,
      )
    },
    DeleteRows(
      variables: DeleteRowsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteRowsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteRowsMutation>(DeleteRowsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteRows',
        'mutation',
        variables,
      )
    },
    PatchRowInline(
      variables: PatchRowInlineMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<PatchRowInlineMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<PatchRowInlineMutation>(PatchRowInlineDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'PatchRowInline',
        'mutation',
        variables,
      )
    },
    GetTableViews(
      variables: GetTableViewsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetTableViewsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetTableViewsQuery>(GetTableViewsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetTableViews',
        'query',
        variables,
      )
    },
    UpdateTableViews(
      variables: UpdateTableViewsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateTableViewsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateTableViewsMutation>(UpdateTableViewsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'UpdateTableViews',
        'mutation',
        variables,
      )
    },
    foreignKeyTableWithRows(
      variables: ForeignKeyTableWithRowsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ForeignKeyTableWithRowsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ForeignKeyTableWithRowsQuery>(ForeignKeyTableWithRowsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'foreignKeyTableWithRows',
        'query',
        variables,
      )
    },
    createRowForStack(
      variables: CreateRowForStackMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateRowForStackMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateRowForStackMutation>(CreateRowForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createRowForStack',
        'mutation',
        variables,
      )
    },
    updateRowForStack(
      variables: UpdateRowForStackMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateRowForStackMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateRowForStackMutation>(UpdateRowForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updateRowForStack',
        'mutation',
        variables,
      )
    },
    renameRowForStack(
      variables: RenameRowForStackMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RenameRowForStackMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RenameRowForStackMutation>(RenameRowForStackDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'renameRowForStack',
        'mutation',
        variables,
      )
    },
    searchRows(
      variables: SearchRowsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<SearchRowsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SearchRowsQuery>(SearchRowsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'searchRows',
        'query',
        variables,
      )
    },
    revertChangesForSidebar(
      variables: RevertChangesForSidebarMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RevertChangesForSidebarMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RevertChangesForSidebarMutation>(RevertChangesForSidebarDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'revertChangesForSidebar',
        'mutation',
        variables,
      )
    },
    createRevisionForSidebar(
      variables: CreateRevisionForSidebarMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateRevisionForSidebarMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateRevisionForSidebarMutation>(CreateRevisionForSidebarDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createRevisionForSidebar',
        'mutation',
        variables,
      )
    },
    createBranchForSidebar(
      variables: CreateBranchForSidebarMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateBranchForSidebarMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateBranchForSidebarMutation>(CreateBranchForSidebarDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createBranchForSidebar',
        'mutation',
        variables,
      )
    },
    deleteTableForList(
      variables: DeleteTableForListMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteTableForListMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteTableForListMutation>(DeleteTableForListDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteTableForList',
        'mutation',
        variables,
      )
    },
    tableListData(
      variables: TableListDataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<TableListDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TableListDataQuery>(TableListDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'tableListData',
        'query',
        variables,
      )
    },
    tableRelationsData(
      variables: TableRelationsDataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<TableRelationsDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TableRelationsDataQuery>(TableRelationsDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'tableRelationsData',
        'query',
        variables,
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
