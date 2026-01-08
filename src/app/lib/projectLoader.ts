import { LoaderFunction } from 'react-router-dom'
import { when } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const projectLoader: LoaderFunction = async () => {
  const context = container.get(ProjectContext)

  await when(() => !context.isProjectLoading && (context.projectOrNull !== null || context.projectError !== null))

  if (context.projectError) {
    throw new Response(context.projectError, { status: 404 })
  }

  return null
}
