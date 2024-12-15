import { IBackendStore } from 'src/shared/model/BackendStore/BackendStore.ts'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { QueryRevisionsHandlerType, QueryTablesHandlerType } from 'src/shared/model/BackendStore/handlers/queries'
import { QueryGetRowCountReferencesByHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryGetRowCountReferencesBy.ts'
import { QueryRowHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryRow.ts'
import { QueryRowReferencesByHandler } from 'src/shared/model/BackendStore/handlers/queries/queryRowReferencesBy.ts'
import { QueryTableHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryTable.ts'
import { QueryRowsHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryRows.ts'
import { QueryTableReferencesByHandler } from 'src/shared/model/BackendStore/handlers/queries/queryTableReferencesBy.ts'
import { IRevisionModel, ITableModel } from 'src/shared/model/BackendStore/model'
import { IOrganizationModel } from 'src/shared/model/BackendStore/model/organization.mst.ts'

export type IRootStore = { cache: ICacheModel; backend: IBackendStore } & {
  organization: IOrganizationModel | undefined
  revision: IRevisionModel | undefined
  table: ITableModel | undefined
} & {
  organizationOrThrow: IOrganizationModel
  revisionOrThrow: IRevisionModel
  tableOrThrow: ITableModel
} & {
  selectOrganization(value: IOrganizationModel | null): void
} & {
  queryRevisions: QueryRevisionsHandlerType['execute']
  queryTable: QueryTableHandlerType['execute']
  queryTableReferencesBy: QueryTableReferencesByHandler['execute']
  queryTables: QueryTablesHandlerType['execute']
  queryRow: QueryRowHandlerType['execute']
  queryRowReferencesBy: QueryRowReferencesByHandler['execute']
  queryGetRowCountReferencesBy: QueryGetRowCountReferencesByHandlerType['execute']
  queryRows: QueryRowsHandlerType['execute']
}

export interface IQueryHandler<Variables, Result> {
  execute(query: Variables): Promise<Result>
}
