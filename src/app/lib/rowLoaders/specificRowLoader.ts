import { LoaderFunction } from 'react-router-dom'
import { refsLoader } from 'src/app/lib/rowLoaders/refsLoader.ts'
import { getRowVariables, waitForSpecificRevision } from 'src/app/lib/utils.ts'
import { NotFoundRow } from 'src/shared/errors/NotFoundRow.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const specificRowLoader: LoaderFunction = async ({ params }) => {
  const revision = await waitForSpecificRevision(params)

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
