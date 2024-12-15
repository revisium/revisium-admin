import { flow, types } from 'mobx-state-tree'
import { CacheModel, ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { getQueryMeProjectsHandler, QueryProjectsHandlerType } from 'src/shared/model/BackendStore/handlers/queries'
import {
  getQueryBranchHandler,
  QueryBranchHandlerType,
} from 'src/shared/model/BackendStore/handlers/queries/queryBranch.ts'
import {
  getQueryBranchesHandler,
  QueryBranchesHandlerType,
} from 'src/shared/model/BackendStore/handlers/queries/queryBranches.ts'
import {
  getQueryProjectHandler,
  QueryProjectHandlerType,
} from 'src/shared/model/BackendStore/handlers/queries/queryProject.ts'
import {
  getQueryRevisionHandler,
  QueryRevisionHandlerType,
} from 'src/shared/model/BackendStore/handlers/queries/queryRevision.ts'

export const BackendStore = types
  .model({
    cache: types.reference(CacheModel),
  })
  .actions((self) => ({
    queryMeProjects: flow(getQueryMeProjectsHandler(self as unknown as IBackendStore)),
    queryProject: flow(getQueryProjectHandler(self as unknown as IBackendStore)),
    queryBranches: flow(getQueryBranchesHandler(self as unknown as IBackendStore)),
    queryBranch: flow(getQueryBranchHandler(self as unknown as IBackendStore)),
    queryRevision: flow(getQueryRevisionHandler(self as unknown as IBackendStore)),
  }))

export type IBackendStore = Readonly<
  {
    cache: ICacheModel
  } & {
    queryProject: QueryProjectHandlerType
    queryMeProjects: QueryProjectsHandlerType
    queryBranch: QueryBranchHandlerType
    queryBranches: QueryBranchesHandlerType
    queryRevision: QueryRevisionHandlerType
  }
>
