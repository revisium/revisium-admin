import { flow, Instance, types } from 'mobx-state-tree'
import {
  BackendStore,
  BranchModel,
  ProjectModel,
  RevisionModel,
  RowModel,
  TableModel,
} from 'src/shared/model/BackendStore'
import { CacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { QueryRevisionsHandler, QueryRevisionsHandlerVariables } from 'src/shared/model/BackendStore/handlers/queries'
import {
  QueryGetRowCountReferencesByHandler,
  QueryGetRowCountReferencesByHandlerVariables,
} from 'src/shared/model/BackendStore/handlers/queries/queryGetRowCountReferencesBy.ts'
import { QueryRowHandler, QueryRowHandlerVariables } from 'src/shared/model/BackendStore/handlers/queries/queryRow.ts'
import {
  QueryRowReferencesByHandler,
  QueryRowReferencesByHandlerVariables,
} from 'src/shared/model/BackendStore/handlers/queries/queryRowReferencesBy.ts'
import {
  QueryTableHandler,
  QueryTableHandlerVariables,
} from 'src/shared/model/BackendStore/handlers/queries/queryTable.ts'
import {
  QueryTableReferencesByHandler,
  QueryTableReferencesByHandlerVariables,
} from 'src/shared/model/BackendStore/handlers/queries/queryTableReferencesBy.ts'
import {
  QueryTablesHandler,
  QueryTablesHandlerVariables,
} from 'src/shared/model/BackendStore/handlers/queries/queryTables.ts'
import {
  QueryRowsHandler,
  QueryRowsHandlerVariables,
} from 'src/shared/model/BackendStore/handlers/queries/queryRows.ts'
import { OrganizationModel } from 'src/shared/model/BackendStore/model/organization.mst.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'

const RootStore = types
  .model({
    organization: types.maybeNull(types.reference(types.late(() => OrganizationModel))),
    project: types.maybeNull(types.reference(types.late(() => ProjectModel))),
    branch: types.maybeNull(types.reference(types.late(() => BranchModel))),
    table: types.maybeNull(types.reference(types.late(() => TableModel))),
    row: types.maybeNull(types.reference(types.late(() => RowModel))),
    revision: types.maybeNull(types.reference(types.late(() => RevisionModel))),
    cache: CacheModel,
    backend: BackendStore, // TODO remove
  })
  .views((self) => ({
    get organizationOrThrow() {
      if (!self.organization) {
        throw new Error('Not found organization')
      }
      return self.organization
    },

    get projectOrThrow() {
      if (!self.project) {
        throw new Error('Not found project')
      }
      return self.project
    },

    get branchOrThrow() {
      if (!self.branch) {
        throw new Error('Not found branch')
      }
      return self.branch
    },

    get revisionOrThrow() {
      if (!self.revision) {
        throw new Error('Not found revision')
      }
      return self.revision
    },

    get tableOrThrow() {
      if (!self.table) {
        throw new Error('Not found table')
      }
      return self.table
    },

    get rowOrThrow() {
      if (!self.row) {
        throw new Error('Not found row')
      }
      return self.row
    },
  }))
  .actions((self) => ({
    selectOrganization(value: Instance<typeof OrganizationModel> | null) {
      self.organization = value
    },
    selectProject(value: Instance<typeof ProjectModel> | null) {
      self.project = value
    },
    selectBranch(value: Instance<typeof BranchModel> | null) {
      self.branch = value
    },
    selectRevision(value: Instance<typeof RevisionModel> | null) {
      self.revision = value
    },
    selectTable(value: Instance<typeof TableModel> | null) {
      self.table = value
    },
    selectRow(value: Instance<typeof RowModel> | null) {
      self.row = value
    },
  }))
  .actions((self) => {
    const root: IRootStore = self as unknown as IRootStore

    const mapper = {
      queryRevisions: new QueryRevisionsHandler(root),
      queryTable: new QueryTableHandler(root),
      queryTableReferencesBy: new QueryTableReferencesByHandler(root),
      queryTables: new QueryTablesHandler(root),
      queryRow: new QueryRowHandler(root),
      queryRowReferencesBy: new QueryRowReferencesByHandler(root),
      queryGetRowCountReferencesBy: new QueryGetRowCountReferencesByHandler(root),
      queryRows: new QueryRowsHandler(root),
    } as const

    return {
      queryRevisions: flow(function* (variables: QueryRevisionsHandlerVariables) {
        return yield mapper.queryRevisions.execute(variables)
      }),
      queryTable: flow(function* (variables: QueryTableHandlerVariables) {
        return yield mapper.queryTable.execute(variables)
      }),
      queryTableReferencesBy: flow(function* (variables: QueryTableReferencesByHandlerVariables) {
        return yield mapper.queryTableReferencesBy.execute(variables)
      }),
      queryTables: flow(function* (variables: QueryTablesHandlerVariables) {
        return yield mapper.queryTables.execute(variables)
      }),
      queryRow: flow(function* (variables: QueryRowHandlerVariables) {
        return yield mapper.queryRow.execute(variables)
      }),
      queryRowReferencesBy: flow(function* (variables: QueryRowReferencesByHandlerVariables) {
        return yield mapper.queryRowReferencesBy.execute(variables)
      }),
      queryGetRowCountReferencesBy: flow(function* (variables: QueryGetRowCountReferencesByHandlerVariables) {
        return yield mapper.queryGetRowCountReferencesBy.execute(variables)
      }),
      queryRows: flow(function* (variables: QueryRowsHandlerVariables) {
        return yield mapper.queryRows.execute(variables)
      }),
    }
  })

export let rootStore = RootStore.create({
  cache: {
    id: '1',
  },
  backend: {
    cache: '1',
  },
}) as unknown as IRootStore

export const resetRootStore = () => {
  rootStore = RootStore.create({
    cache: {
      id: '1',
    },
    backend: {
      cache: '1',
    },
  }) as unknown as IRootStore
}
