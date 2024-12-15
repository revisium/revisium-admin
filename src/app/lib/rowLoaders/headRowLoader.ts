import { LoaderFunction } from 'react-router-dom'
import { refsLoader } from 'src/app/lib/rowLoaders/refsLoader.ts'
import { getRowVariables, waitForBranch } from 'src/app/lib/utils.ts'
import { NotFoundRow } from 'src/shared/errors/NotFoundRow.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const headRowLoader: LoaderFunction = async ({ params }) => {
  const branch = await waitForBranch(params)
  const revision = branch.head

  const variables = getRowVariables(params, revision.id)

  const row = rootStore.cache.getRowByVariables(variables) || (await rootStore.queryRow(variables))

  if (!row) {
    throw new NotFoundRow(params.rowId)
  }

  if (!rootStore.cache.getRowRefsByVariables(variables)) {
    await rootStore.queryGetRowCountReferencesBy(variables)
  }

  await refsLoader(variables) // TODO separate route

  return row
}
