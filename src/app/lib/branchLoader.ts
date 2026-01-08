import { LoaderFunction } from 'react-router-dom'
import { when } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const branchLoader: LoaderFunction = async () => {
  const context = container.get(ProjectContext)

  await when(() => !context.isBranchLoading && context.branchOrNull !== null)

  return null
}
