import { reaction } from 'mobx'
import { Params } from 'react-router-dom'
import { IBranchModel, IProjectModel, IRevisionModel, ITableModel } from 'src/shared/model/BackendStore'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const waitForProject = async (params: Params): Promise<IProjectModel> =>
  waitForEntity(() => rootStore.cache.getProjectByVariables(getProjectVariables(params)))

export const waitForBranch = async (params: Params): Promise<IBranchModel> =>
  waitForEntity(() => rootStore.cache.getBranchByVariables(getBranchVariables(params)))

export const waitForSpecificRevision = async (params: Params): Promise<IRevisionModel> =>
  waitForEntity(() => rootStore.cache.getRevision(getSpecificRevisionVariables(params).revisionId))

export const waitForTable = async (params: Params, revisionId: string): Promise<ITableModel> =>
  waitForEntity(() => rootStore.cache.getTableByVariables(getTableVariables(params, revisionId)))

export const getOrganizationVariables = (params: Params) => {
  const { organizationId } = params

  if (!organizationId) {
    throw new Error('Not found organizationId in route params')
  }

  return { organizationId }
}

export const getProjectVariables = (params: Params) => {
  const { projectName } = params

  if (!projectName) {
    throw new Error('Not found projectName in route params')
  }

  return { ...getOrganizationVariables(params), projectName }
}

export const getBranchVariables = (params: Params) => {
  const { branchName } = params

  if (!branchName) {
    throw new Error('Not found branchName in route params')
  }

  return { ...getProjectVariables(params), branchName }
}

export const getSpecificRevisionVariables = (params: Params) => {
  const { revisionId } = params

  if (!revisionId) {
    throw new Error('Not found revisionId in route params')
  }

  return { revisionId }
}

export const getTableVariables = (params: Params, revisionId: string) => {
  const { tableId } = params

  if (!tableId) {
    throw new Error('Not found tableId in route params')
  }

  return { revisionId, tableId }
}

export const getRowVariables = (params: Params, revisionId: string) => {
  const { rowId } = params

  if (!rowId) {
    throw new Error('Not found rowId in route params')
  }

  return { ...getTableVariables(params, revisionId), rowId }
}

type CacheFetcher<EntityType> = () => EntityType | undefined

const waitForEntityReaction = <EntityType>(fetchFromCache: CacheFetcher<EntityType>): Promise<EntityType> => {
  return new Promise((resolve) => {
    const disposer = reaction(fetchFromCache, (entity) => {
      if (entity) {
        disposer()
        resolve(entity)
      }
    })
  })
}

const waitForEntity = async <EntityType>(fetchFromCache: CacheFetcher<EntityType>): Promise<EntityType> => {
  const entity = fetchFromCache()

  if (entity) {
    return entity
  }

  return waitForEntityReaction(fetchFromCache)
}
