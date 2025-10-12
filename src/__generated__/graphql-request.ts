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
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  revision: RevisionModel
  type: EndpointType
}

export enum EndpointType {
  Graphql = 'GRAPHQL',
  RestApi = 'REST_API',
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
  available: Scalars['Boolean']['output']
  clientId?: Maybe<Scalars['String']['output']>
}

export type GoogleOauth = {
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
  accessToken: Scalars['String']['output']
}

export type Mutation = {
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
  CreatedAt = 'createdAt',
  Data = 'data',
  Id = 'id',
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

export type PluginsModel = {
  file: Scalars['Boolean']['output']
}

export type ProjectModel = {
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
  cursor: Scalars['String']['output']
  node: ProjectModel
}

export type ProjectsConnection = {
  edges: Array<ProjectModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Query = {
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
  Default = 'default',
  Insensitive = 'insensitive',
}

export type RemoveRowInput = {
  revisionId: Scalars['String']['input']
  rowId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type RemoveRowResultModel = {
  branch: BranchModel
  previousVersionTableId?: Maybe<Scalars['String']['output']>
  table?: Maybe<TableModel>
}

export type RemoveTableInput = {
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type RemoveTableResultModel = {
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

export type RevertChangesInput = {
  branchName: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  projectName: Scalars['String']['input']
}

export type RevisionConnection = {
  edges: Array<RevisionModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type RevisionModel = {
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
  cursor: Scalars['String']['output']
  node: RevisionModel
}

export type RoleModel = {
  id: Scalars['String']['output']
  name: Scalars['String']['output']
}

export type RowModel = {
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
  cursor: Scalars['String']['output']
  node: RowModel
}

export type RowsConnection = {
  edges: Array<RowModelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export enum SearchIn {
  All = 'all',
  Booleans = 'booleans',
  Keys = 'keys',
  Numbers = 'numbers',
  Strings = 'strings',
  Values = 'values',
}

export enum SearchType {
  Phrase = 'phrase',
  Plain = 'plain',
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

export type UpdateTableInput = {
  patches: Scalars['JSON']['input']
  revisionId: Scalars['String']['input']
  tableId: Scalars['String']['input']
}

export type UpdateTableResultModel = {
  previousVersionTableId: Scalars['String']['output']
  table: TableModel
}

export type UserModel = {
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  organizationId?: Maybe<Scalars['String']['output']>
  username?: Maybe<Scalars['String']['output']>
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

export type PageInfoFragment = {
  startCursor?: string | null
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor?: string | null
}

export type FindForeignKeyQueryVariables = Exact<{
  data: GetRowsInput
}>

export type FindForeignKeyQuery = {
  rows: {
    totalCount: number
    pageInfo: { startCursor?: string | null; hasNextPage: boolean; hasPreviousPage: boolean; endCursor?: string | null }
    edges: Array<{ cursor: string; node: { id: string } }>
  }
}

export type ConfirmEmailCodeMutationVariables = Exact<{
  data: ConfirmEmailCodeInput
}>

export type ConfirmEmailCodeMutation = { confirmEmailCode: { accessToken: string } }

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

export type SignUpMutationVariables = Exact<{
  data: SignUpInput
}>

export type SignUpMutation = { signUp: boolean }

export type SetUsernameMutationVariables = Exact<{
  data: SetUsernameInput
}>

export type SetUsernameMutation = { setUsername: boolean }

export type ConfigurationQueryVariables = Exact<{ [key: string]: never }>

export type ConfigurationQuery = {
  configuration: {
    availableEmailSignUp: boolean
    google: { available: boolean; clientId?: string | null }
    github: { available: boolean; clientId?: string | null }
    plugins: { file: boolean }
  }
}

export type UserFragment = {
  id: string
  username?: string | null
  email?: string | null
  organizationId?: string | null
}

export type GetMeQueryVariables = Exact<{ [key: string]: never }>

export type GetMeQuery = {
  me: { id: string; username?: string | null; email?: string | null; organizationId?: string | null }
}

export type BranchMstFragment = {
  id: string
  createdAt: string
  name: string
  touched: boolean
  projectId: string
  parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
  start: {
    id: string
    createdAt: string
    comment: string
    child?: { id: string } | null
    childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  }
  head: {
    id: string
    createdAt: string
    comment: string
    parent?: { id: string } | null
    child?: { id: string } | null
    childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  }
  draft: {
    id: string
    createdAt: string
    comment: string
    parent?: { id: string } | null
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  }
}

export type EndpointMstFragment = { id: string; type: EndpointType; createdAt: string }

export type PageInfoMstFragment = {
  startCursor?: string | null
  endCursor?: string | null
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type ProjectMstFragment = {
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
    parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
    start: {
      id: string
      createdAt: string
      comment: string
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    head: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    draft: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
  }
}

export type RevisionMstFragment = {
  id: string
  createdAt: string
  comment: string
  parent?: { id: string } | null
  child?: { id: string } | null
  childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
  endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
}

export type RevisionStartMstFragment = {
  id: string
  createdAt: string
  comment: string
  child?: { id: string } | null
  childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
  endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
}

export type RevisionDraftMstFragment = {
  id: string
  createdAt: string
  comment: string
  parent?: { id: string } | null
  endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
}

export type RowMstFragment = {
  createdId: string
  id: string
  versionId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  data: { [key: string]: any } | string | number | boolean | null
}

export type TableMstFragment = {
  createdId: string
  id: string
  versionId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export type CreateBranchByRevisionIdMstMutationVariables = Exact<{
  data: CreateBranchByRevisionIdInput
}>

export type CreateBranchByRevisionIdMstMutation = {
  createBranchByRevisionId: {
    id: string
    createdAt: string
    name: string
    touched: boolean
    projectId: string
    parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
    start: {
      id: string
      createdAt: string
      comment: string
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    head: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    draft: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
  }
}

export type CreateEndpointMstMutationVariables = Exact<{
  data: CreateEndpointInput
}>

export type CreateEndpointMstMutation = { createEndpoint: { id: string; type: EndpointType; createdAt: string } }

export type CreateProjectMstMutationVariables = Exact<{
  data: CreateProjectInput
}>

export type CreateProjectMstMutation = {
  createProject: {
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
      parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
      start: {
        id: string
        createdAt: string
        comment: string
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      head: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      draft: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
    }
  }
}

export type CreateRevisionMstMutationVariables = Exact<{
  data: CreateRevisionInput
}>

export type CreateRevisionMstMutation = {
  createRevision: {
    id: string
    createdAt: string
    comment: string
    branch: {
      id: string
      createdAt: string
      name: string
      touched: boolean
      projectId: string
      parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
      start: {
        id: string
        createdAt: string
        comment: string
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      head: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      draft: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
    }
    parent?: { id: string } | null
    child?: { id: string } | null
    childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  }
}

export type CreateRowMstMutationVariables = Exact<{
  data: CreateRowInput
}>

export type CreateRowMstMutation = {
  createRow: {
    previousVersionTableId: string
    table: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type CreateTableMstMutationVariables = Exact<{
  data: CreateTableInput
}>

export type CreateTableMstMutation = {
  createTable: {
    branch: {
      id: string
      createdAt: string
      name: string
      touched: boolean
      projectId: string
      parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
      start: {
        id: string
        createdAt: string
        comment: string
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      head: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      draft: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
    }
    table: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type DeleteEndpointMstMutationVariables = Exact<{
  data: DeleteEndpointInput
}>

export type DeleteEndpointMstMutation = { deleteEndpoint: boolean }

export type DeleteProjectMstMutationVariables = Exact<{
  data: DeleteProjectInput
}>

export type DeleteProjectMstMutation = { deleteProject: boolean }

export type DeleteRowMstMutationVariables = Exact<{
  data: RemoveRowInput
}>

export type DeleteRowMstMutation = {
  removeRow: {
    previousVersionTableId?: string | null
    branch: {
      id: string
      createdAt: string
      name: string
      touched: boolean
      projectId: string
      parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
      start: {
        id: string
        createdAt: string
        comment: string
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      head: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      draft: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
    }
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
}

export type DeleteTableMstMutationVariables = Exact<{
  data: RemoveTableInput
}>

export type DeleteTableMstMutation = {
  removeTable: {
    branch: {
      id: string
      createdAt: string
      name: string
      touched: boolean
      projectId: string
      parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
      start: {
        id: string
        createdAt: string
        comment: string
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      head: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      draft: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
    }
  }
}

export type RenameRowMstMutationVariables = Exact<{
  data: RenameRowInput
}>

export type RenameRowMstMutation = {
  renameRow: {
    previousVersionTableId: string
    previousVersionRowId: string
    table: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type RenameTableMstMutationVariables = Exact<{
  data: RenameTableInput
}>

export type RenameTableMstMutation = {
  renameTable: {
    previousVersionTableId: string
    table: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type RevertChangesMstMutationVariables = Exact<{
  data: RevertChangesInput
}>

export type RevertChangesMstMutation = {
  revertChanges: {
    id: string
    createdAt: string
    name: string
    touched: boolean
    projectId: string
    parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
    start: {
      id: string
      createdAt: string
      comment: string
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    head: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    draft: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
  }
}

export type UpdateRowMstMutationVariables = Exact<{
  data: UpdateRowInput
}>

export type UpdateRowMstMutation = {
  updateRow: {
    previousVersionTableId: string
    previousVersionRowId: string
    table: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type UpdateTableMstMutationVariables = Exact<{
  data: UpdateTableInput
}>

export type UpdateTableMstMutation = {
  updateTable: {
    previousVersionTableId: string
    table: {
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export type BranchMstQueryVariables = Exact<{
  data: GetBranchInput
}>

export type BranchMstQuery = {
  branch: {
    id: string
    createdAt: string
    name: string
    touched: boolean
    projectId: string
    parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
    start: {
      id: string
      createdAt: string
      comment: string
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    head: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      child?: { id: string } | null
      childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
    draft: {
      id: string
      createdAt: string
      comment: string
      parent?: { id: string } | null
      endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
    }
  }
}

export type BranchesMstQueryVariables = Exact<{
  data: GetBranchesInput
}>

export type BranchesMstQuery = {
  branches: {
    totalCount: number
    pageInfo: { startCursor?: string | null; endCursor?: string | null; hasPreviousPage: boolean; hasNextPage: boolean }
    edges: Array<{
      cursor: string
      node: {
        id: string
        createdAt: string
        name: string
        touched: boolean
        projectId: string
        parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
        start: {
          id: string
          createdAt: string
          comment: string
          child?: { id: string } | null
          childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
        }
        head: {
          id: string
          createdAt: string
          comment: string
          parent?: { id: string } | null
          child?: { id: string } | null
          childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
        }
        draft: {
          id: string
          createdAt: string
          comment: string
          parent?: { id: string } | null
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
        }
      }
    }>
  }
}

export type GetRowCountForeignKeysToQueryVariables = Exact<{
  data: GetRowCountForeignKeysByInput
}>

export type GetRowCountForeignKeysToQuery = { getRowCountForeignKeysTo: number }

export type MeProjectsMstQueryVariables = Exact<{
  data: GetMeProjectsInput
}>

export type MeProjectsMstQuery = {
  meProjects: {
    totalCount: number
    pageInfo: { startCursor?: string | null; endCursor?: string | null; hasPreviousPage: boolean; hasNextPage: boolean }
    edges: Array<{
      cursor: string
      node: {
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
          parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
          start: {
            id: string
            createdAt: string
            comment: string
            child?: { id: string } | null
            childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          }
          head: {
            id: string
            createdAt: string
            comment: string
            parent?: { id: string } | null
            child?: { id: string } | null
            childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          }
          draft: {
            id: string
            createdAt: string
            comment: string
            parent?: { id: string } | null
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          }
        }
      }
    }>
  }
}

export type ProjectMstQueryVariables = Exact<{
  data: GetProjectInput
}>

export type ProjectMstQuery = {
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
      parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
      start: {
        id: string
        createdAt: string
        comment: string
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      head: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        child?: { id: string } | null
        childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
      draft: {
        id: string
        createdAt: string
        comment: string
        parent?: { id: string } | null
        endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
      }
    }
  }
}

export type ProjectsMstQueryVariables = Exact<{
  data: GetProjectsInput
}>

export type ProjectsMstQuery = {
  projects: {
    totalCount: number
    pageInfo: { startCursor?: string | null; endCursor?: string | null; hasPreviousPage: boolean; hasNextPage: boolean }
    edges: Array<{
      cursor: string
      node: {
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
          parent?: { branch: { id: string; name: string }; revision: { id: string } } | null
          start: {
            id: string
            createdAt: string
            comment: string
            child?: { id: string } | null
            childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          }
          head: {
            id: string
            createdAt: string
            comment: string
            parent?: { id: string } | null
            child?: { id: string } | null
            childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          }
          draft: {
            id: string
            createdAt: string
            comment: string
            parent?: { id: string } | null
            endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          }
        }
      }
    }>
  }
}

export type RevisionMstQueryVariables = Exact<{
  data: GetRevisionInput
}>

export type RevisionMstQuery = {
  revision: {
    id: string
    createdAt: string
    comment: string
    branch: { id: string }
    parent?: { id: string } | null
    child?: { id: string } | null
    childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
    endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  }
}

export type BranchRevisionMstFragment = {
  id: string
  createdAt: string
  comment: string
  endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
  parent?: { id: string } | null
  child?: { id: string } | null
  childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
}

export type RevisionsMstQueryVariables = Exact<{
  branch: GetBranchInput
  revisions: GetBranchRevisionsInput
}>

export type RevisionsMstQuery = {
  branch: {
    id: string
    revisions: {
      totalCount: number
      pageInfo: {
        startCursor?: string | null
        endCursor?: string | null
        hasPreviousPage: boolean
        hasNextPage: boolean
      }
      edges: Array<{
        cursor: string
        node: {
          id: string
          createdAt: string
          comment: string
          endpoints: Array<{ id: string; type: EndpointType; createdAt: string }>
          parent?: { id: string } | null
          child?: { id: string } | null
          childBranches: Array<{ branch: { id: string; name: string }; revision: { id: string } }>
        }
      }>
    }
  }
}

export type RowForeignKeysByQueryVariables = Exact<{
  data: GetRowInput
  foreignKeyData: GetRowForeignKeysInput
}>

export type RowForeignKeysByQuery = {
  row?: {
    versionId: string
    rowForeignKeysBy: {
      totalCount: number
      pageInfo: {
        startCursor?: string | null
        endCursor?: string | null
        hasPreviousPage: boolean
        hasNextPage: boolean
      }
      edges: Array<{
        cursor: string
        node: {
          createdId: string
          id: string
          versionId: string
          createdAt: string
          updatedAt: string
          readonly: boolean
          data: { [key: string]: any } | string | number | boolean | null
        }
      }>
    }
  } | null
}

export type RowMstQueryVariables = Exact<{
  data: GetRowInput
}>

export type RowMstQuery = {
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

export type RowsMstQueryVariables = Exact<{
  data: GetRowsInput
}>

export type RowsMstQuery = {
  rows: {
    totalCount: number
    pageInfo: { startCursor?: string | null; endCursor?: string | null; hasPreviousPage: boolean; hasNextPage: boolean }
    edges: Array<{
      cursor: string
      node: {
        createdId: string
        id: string
        versionId: string
        createdAt: string
        updatedAt: string
        readonly: boolean
        data: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export type TableForeignKeysByQueryVariables = Exact<{
  data: GetTableInput
  foreignKeyData: GetTableForeignKeysInput
}>

export type TableForeignKeysByQuery = {
  table?: {
    versionId: string
    foreignKeysBy: {
      totalCount: number
      pageInfo: {
        startCursor?: string | null
        endCursor?: string | null
        hasPreviousPage: boolean
        hasNextPage: boolean
      }
      edges: Array<{
        cursor: string
        node: {
          createdId: string
          id: string
          versionId: string
          createdAt: string
          updatedAt: string
          readonly: boolean
          count: number
          schema: { [key: string]: any } | string | number | boolean | null
        }
      }>
    }
  } | null
}

export type TableMstQueryVariables = Exact<{
  data: GetTableInput
}>

export type TableMstQuery = {
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

export type TablesMstQueryVariables = Exact<{
  data: GetTablesInput
}>

export type TablesMstQuery = {
  tables: {
    totalCount: number
    pageInfo: { startCursor?: string | null; endCursor?: string | null; hasPreviousPage: boolean; hasNextPage: boolean }
    edges: Array<{
      cursor: string
      node: {
        createdId: string
        id: string
        versionId: string
        createdAt: string
        updatedAt: string
        readonly: boolean
        count: number
        schema: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export const PageInfoFragmentDoc = gql`
  fragment PageInfo on PageInfo {
    startCursor
    hasNextPage
    hasPreviousPage
    endCursor
  }
`
export const UserFragmentDoc = gql`
  fragment User on UserModel {
    id
    username
    email
    organizationId
  }
`
export const PageInfoMstFragmentDoc = gql`
  fragment PageInfoMst on PageInfo {
    startCursor
    endCursor
    hasPreviousPage
    hasNextPage
  }
`
export const EndpointMstFragmentDoc = gql`
  fragment EndpointMst on EndpointModel {
    id
    type
    createdAt
  }
`
export const RevisionStartMstFragmentDoc = gql`
  fragment RevisionStartMst on RevisionModel {
    id
    createdAt
    comment
    child {
      id
    }
    childBranches {
      branch {
        id
        name
      }
      revision {
        id
      }
    }
    endpoints {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export const RevisionMstFragmentDoc = gql`
  fragment RevisionMst on RevisionModel {
    id
    createdAt
    comment
    parent {
      id
    }
    child {
      id
    }
    childBranches {
      branch {
        id
        name
      }
      revision {
        id
      }
    }
    endpoints {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export const RevisionDraftMstFragmentDoc = gql`
  fragment RevisionDraftMst on RevisionModel {
    id
    createdAt
    comment
    parent {
      id
    }
    endpoints {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export const BranchMstFragmentDoc = gql`
  fragment BranchMst on BranchModel {
    id
    createdAt
    name
    touched
    projectId
    parent {
      branch {
        id
        name
      }
      revision {
        id
      }
    }
    start {
      ...RevisionStartMst
    }
    head {
      ...RevisionMst
    }
    draft {
      ...RevisionDraftMst
    }
  }
  ${RevisionStartMstFragmentDoc}
  ${RevisionMstFragmentDoc}
  ${RevisionDraftMstFragmentDoc}
`
export const ProjectMstFragmentDoc = gql`
  fragment ProjectMst on ProjectModel {
    id
    organizationId
    createdAt
    name
    isPublic
    rootBranch {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`
export const RowMstFragmentDoc = gql`
  fragment RowMst on RowModel {
    createdId
    id
    versionId
    createdAt
    updatedAt
    readonly
    data
  }
`
export const TableMstFragmentDoc = gql`
  fragment TableMst on TableModel {
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
export const BranchRevisionMstFragmentDoc = gql`
  fragment BranchRevisionMst on RevisionModel {
    ...RevisionMst
    endpoints {
      ...EndpointMst
    }
  }
  ${RevisionMstFragmentDoc}
  ${EndpointMstFragmentDoc}
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
export const ConfirmEmailCodeDocument = gql`
  mutation confirmEmailCode($data: ConfirmEmailCodeInput!) {
    confirmEmailCode(data: $data) {
      accessToken
    }
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
export const CreateBranchByRevisionIdMstDocument = gql`
  mutation CreateBranchByRevisionIdMst($data: CreateBranchByRevisionIdInput!) {
    createBranchByRevisionId(data: $data) {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`
export const CreateEndpointMstDocument = gql`
  mutation CreateEndpointMst($data: CreateEndpointInput!) {
    createEndpoint(data: $data) {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export const CreateProjectMstDocument = gql`
  mutation CreateProjectMst($data: CreateProjectInput!) {
    createProject(data: $data) {
      ...ProjectMst
    }
  }
  ${ProjectMstFragmentDoc}
`
export const CreateRevisionMstDocument = gql`
  mutation CreateRevisionMst($data: CreateRevisionInput!) {
    createRevision(data: $data) {
      ...RevisionMst
      branch {
        ...BranchMst
      }
    }
  }
  ${RevisionMstFragmentDoc}
  ${BranchMstFragmentDoc}
`
export const CreateRowMstDocument = gql`
  mutation CreateRowMst($data: CreateRowInput!) {
    createRow(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
      row {
        ...RowMst
      }
    }
  }
  ${TableMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export const CreateTableMstDocument = gql`
  mutation CreateTableMst($data: CreateTableInput!) {
    createTable(data: $data) {
      branch {
        ...BranchMst
      }
      table {
        ...TableMst
      }
    }
  }
  ${BranchMstFragmentDoc}
  ${TableMstFragmentDoc}
`
export const DeleteEndpointMstDocument = gql`
  mutation DeleteEndpointMst($data: DeleteEndpointInput!) {
    deleteEndpoint(data: $data)
  }
`
export const DeleteProjectMstDocument = gql`
  mutation DeleteProjectMst($data: DeleteProjectInput!) {
    deleteProject(data: $data)
  }
`
export const DeleteRowMstDocument = gql`
  mutation DeleteRowMst($data: RemoveRowInput!) {
    removeRow(data: $data) {
      branch {
        ...BranchMst
      }
      table {
        ...TableMst
      }
      previousVersionTableId
    }
  }
  ${BranchMstFragmentDoc}
  ${TableMstFragmentDoc}
`
export const DeleteTableMstDocument = gql`
  mutation DeleteTableMst($data: RemoveTableInput!) {
    removeTable(data: $data) {
      branch {
        ...BranchMst
      }
    }
  }
  ${BranchMstFragmentDoc}
`
export const RenameRowMstDocument = gql`
  mutation RenameRowMst($data: RenameRowInput!) {
    renameRow(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
      row {
        ...RowMst
      }
      previousVersionRowId
    }
  }
  ${TableMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export const RenameTableMstDocument = gql`
  mutation RenameTableMst($data: RenameTableInput!) {
    renameTable(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
    }
  }
  ${TableMstFragmentDoc}
`
export const RevertChangesMstDocument = gql`
  mutation RevertChangesMst($data: RevertChangesInput!) {
    revertChanges(data: $data) {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`
export const UpdateRowMstDocument = gql`
  mutation UpdateRowMst($data: UpdateRowInput!) {
    updateRow(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
      row {
        ...RowMst
      }
      previousVersionRowId
    }
  }
  ${TableMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export const UpdateTableMstDocument = gql`
  mutation UpdateTableMst($data: UpdateTableInput!) {
    updateTable(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
    }
  }
  ${TableMstFragmentDoc}
`
export const BranchMstDocument = gql`
  query BranchMst($data: GetBranchInput!) {
    branch(data: $data) {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`
export const BranchesMstDocument = gql`
  query BranchesMst($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...BranchMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${BranchMstFragmentDoc}
`
export const GetRowCountForeignKeysToDocument = gql`
  query GetRowCountForeignKeysTo($data: GetRowCountForeignKeysByInput!) {
    getRowCountForeignKeysTo(data: $data)
  }
`
export const MeProjectsMstDocument = gql`
  query meProjectsMst($data: GetMeProjectsInput!) {
    meProjects(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...ProjectMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${ProjectMstFragmentDoc}
`
export const ProjectMstDocument = gql`
  query ProjectMst($data: GetProjectInput!) {
    project(data: $data) {
      ...ProjectMst
    }
  }
  ${ProjectMstFragmentDoc}
`
export const ProjectsMstDocument = gql`
  query ProjectsMst($data: GetProjectsInput!) {
    projects(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...ProjectMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${ProjectMstFragmentDoc}
`
export const RevisionMstDocument = gql`
  query RevisionMst($data: GetRevisionInput!) {
    revision(data: $data) {
      ...RevisionMst
      branch {
        id
      }
    }
  }
  ${RevisionMstFragmentDoc}
`
export const RevisionsMstDocument = gql`
  query RevisionsMst($branch: GetBranchInput!, $revisions: GetBranchRevisionsInput!) {
    branch(data: $branch) {
      id
      revisions(data: $revisions) {
        totalCount
        pageInfo {
          ...PageInfoMst
        }
        edges {
          cursor
          node {
            ...BranchRevisionMst
          }
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${BranchRevisionMstFragmentDoc}
`
export const RowForeignKeysByDocument = gql`
  query RowForeignKeysBy($data: GetRowInput!, $foreignKeyData: GetRowForeignKeysInput!) {
    row(data: $data) {
      versionId
      rowForeignKeysBy(data: $foreignKeyData) {
        totalCount
        pageInfo {
          ...PageInfoMst
        }
        edges {
          cursor
          node {
            ...RowMst
          }
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export const RowMstDocument = gql`
  query RowMst($data: GetRowInput!) {
    row(data: $data) {
      ...RowMst
    }
  }
  ${RowMstFragmentDoc}
`
export const RowsMstDocument = gql`
  query RowsMst($data: GetRowsInput!) {
    rows(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...RowMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export const TableForeignKeysByDocument = gql`
  query TableForeignKeysBy($data: GetTableInput!, $foreignKeyData: GetTableForeignKeysInput!) {
    table(data: $data) {
      versionId
      foreignKeysBy(data: $foreignKeyData) {
        totalCount
        pageInfo {
          ...PageInfoMst
        }
        edges {
          cursor
          node {
            ...TableMst
          }
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${TableMstFragmentDoc}
`
export const TableMstDocument = gql`
  query TableMst($data: GetTableInput!) {
    table(data: $data) {
      ...TableMst
    }
  }
  ${TableMstFragmentDoc}
`
export const TablesMstDocument = gql`
  query TablesMst($data: GetTablesInput!) {
    tables(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...TableMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${TableMstFragmentDoc}
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
    CreateBranchByRevisionIdMst(
      variables: CreateBranchByRevisionIdMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateBranchByRevisionIdMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateBranchByRevisionIdMstMutation>(CreateBranchByRevisionIdMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateBranchByRevisionIdMst',
        'mutation',
        variables,
      )
    },
    CreateEndpointMst(
      variables: CreateEndpointMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateEndpointMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateEndpointMstMutation>(CreateEndpointMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateEndpointMst',
        'mutation',
        variables,
      )
    },
    CreateProjectMst(
      variables: CreateProjectMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateProjectMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateProjectMstMutation>(CreateProjectMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateProjectMst',
        'mutation',
        variables,
      )
    },
    CreateRevisionMst(
      variables: CreateRevisionMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateRevisionMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateRevisionMstMutation>(CreateRevisionMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateRevisionMst',
        'mutation',
        variables,
      )
    },
    CreateRowMst(
      variables: CreateRowMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateRowMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateRowMstMutation>(CreateRowMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateRowMst',
        'mutation',
        variables,
      )
    },
    CreateTableMst(
      variables: CreateTableMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateTableMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateTableMstMutation>(CreateTableMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateTableMst',
        'mutation',
        variables,
      )
    },
    DeleteEndpointMst(
      variables: DeleteEndpointMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteEndpointMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteEndpointMstMutation>(DeleteEndpointMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteEndpointMst',
        'mutation',
        variables,
      )
    },
    DeleteProjectMst(
      variables: DeleteProjectMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteProjectMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteProjectMstMutation>(DeleteProjectMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteProjectMst',
        'mutation',
        variables,
      )
    },
    DeleteRowMst(
      variables: DeleteRowMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteRowMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteRowMstMutation>(DeleteRowMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteRowMst',
        'mutation',
        variables,
      )
    },
    DeleteTableMst(
      variables: DeleteTableMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DeleteTableMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteTableMstMutation>(DeleteTableMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'DeleteTableMst',
        'mutation',
        variables,
      )
    },
    RenameRowMst(
      variables: RenameRowMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RenameRowMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RenameRowMstMutation>(RenameRowMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RenameRowMst',
        'mutation',
        variables,
      )
    },
    RenameTableMst(
      variables: RenameTableMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RenameTableMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RenameTableMstMutation>(RenameTableMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RenameTableMst',
        'mutation',
        variables,
      )
    },
    RevertChangesMst(
      variables: RevertChangesMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RevertChangesMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RevertChangesMstMutation>(RevertChangesMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RevertChangesMst',
        'mutation',
        variables,
      )
    },
    UpdateRowMst(
      variables: UpdateRowMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateRowMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateRowMstMutation>(UpdateRowMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'UpdateRowMst',
        'mutation',
        variables,
      )
    },
    UpdateTableMst(
      variables: UpdateTableMstMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateTableMstMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateTableMstMutation>(UpdateTableMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'UpdateTableMst',
        'mutation',
        variables,
      )
    },
    BranchMst(
      variables: BranchMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<BranchMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<BranchMstQuery>(BranchMstDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'BranchMst',
        'query',
        variables,
      )
    },
    BranchesMst(
      variables: BranchesMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<BranchesMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<BranchesMstQuery>(BranchesMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'BranchesMst',
        'query',
        variables,
      )
    },
    GetRowCountForeignKeysTo(
      variables: GetRowCountForeignKeysToQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetRowCountForeignKeysToQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetRowCountForeignKeysToQuery>(GetRowCountForeignKeysToDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetRowCountForeignKeysTo',
        'query',
        variables,
      )
    },
    meProjectsMst(
      variables: MeProjectsMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<MeProjectsMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<MeProjectsMstQuery>(MeProjectsMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'meProjectsMst',
        'query',
        variables,
      )
    },
    ProjectMst(
      variables: ProjectMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ProjectMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ProjectMstQuery>(ProjectMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'ProjectMst',
        'query',
        variables,
      )
    },
    ProjectsMst(
      variables: ProjectsMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ProjectsMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ProjectsMstQuery>(ProjectsMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'ProjectsMst',
        'query',
        variables,
      )
    },
    RevisionMst(
      variables: RevisionMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RevisionMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RevisionMstQuery>(RevisionMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RevisionMst',
        'query',
        variables,
      )
    },
    RevisionsMst(
      variables: RevisionsMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RevisionsMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RevisionsMstQuery>(RevisionsMstDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RevisionsMst',
        'query',
        variables,
      )
    },
    RowForeignKeysBy(
      variables: RowForeignKeysByQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RowForeignKeysByQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RowForeignKeysByQuery>(RowForeignKeysByDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'RowForeignKeysBy',
        'query',
        variables,
      )
    },
    RowMst(variables: RowMstQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RowMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RowMstQuery>(RowMstDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'RowMst',
        'query',
        variables,
      )
    },
    RowsMst(variables: RowsMstQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RowsMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RowsMstQuery>(RowsMstDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'RowsMst',
        'query',
        variables,
      )
    },
    TableForeignKeysBy(
      variables: TableForeignKeysByQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<TableForeignKeysByQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TableForeignKeysByQuery>(TableForeignKeysByDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'TableForeignKeysBy',
        'query',
        variables,
      )
    },
    TableMst(variables: TableMstQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<TableMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TableMstQuery>(TableMstDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'TableMst',
        'query',
        variables,
      )
    },
    TablesMst(
      variables: TablesMstQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<TablesMstQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TablesMstQuery>(TablesMstDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'TablesMst',
        'query',
        variables,
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
