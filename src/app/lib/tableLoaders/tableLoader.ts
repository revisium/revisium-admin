import { LoaderFunction } from 'react-router-dom'
import { when } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const tableLoader: LoaderFunction = async () => {
  const context = container.get(ProjectContext)

  await when(() => !context.isTableLoading)

  if (context.tableError) {
    throw new Response(context.tableError, { status: 404 })
  }

  return null
}
