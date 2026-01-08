import { LoaderFunction } from 'react-router-dom'
import { when } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const rowLoader: LoaderFunction = async () => {
  const context = container.get(ProjectContext)

  await when(() => !context.isRowLoading && context.row !== null)

  return null
}
