import { reaction } from 'mobx'
import { Params } from 'react-router-dom'
import { BranchLoaderData } from 'src/entities/Branch'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const waitForBranch = async (_params: Params): Promise<BranchLoaderData> => {
  const context = container.get(ProjectContext)
  return waitForEntity(() => {
    const branch = context['_branch']
    if (branch) {
      return branch
    }
    const project = context['_project']
    if (project) {
      return project.rootBranch
    }
    return undefined
  })
}

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
