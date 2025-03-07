import { IBackendStore } from 'src/shared/model/BackendStore/BackendStore.ts'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { QueryRevisionsHandlerType, QueryTablesHandlerType } from 'src/shared/model/BackendStore/handlers/queries'
import { QueryGetRowCountForeignKeysByHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryGetRowCountForeignKeysBy.ts'
import { QueryRowHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryRow.ts'
import { QueryRowForeignKeysByHandler } from 'src/shared/model/BackendStore/handlers/queries/queryRowForeignKeysBy.ts'
import { QueryTableHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryTable.ts'
import { QueryRowsHandlerType } from 'src/shared/model/BackendStore/handlers/queries/queryRows.ts'
import { QueryTableForeignKeysByHandler } from 'src/shared/model/BackendStore/handlers/queries/queryTableForeignKeysBy.ts'
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
  queryTableForeignKeysBy: QueryTableForeignKeysByHandler['execute']
  queryTables: QueryTablesHandlerType['execute']
  queryRow: QueryRowHandlerType['execute']
  queryRowForeignKeysBy: QueryRowForeignKeysByHandler['execute']
  queryGetRowCountForeignKeysBy: QueryGetRowCountForeignKeysByHandlerType['execute']
  queryRows: QueryRowsHandlerType['execute']
}

export interface IQueryHandler<Variables, Result> {
  execute(query: Variables): Promise<Result>
}
