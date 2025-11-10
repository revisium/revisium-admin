import { Params } from 'react-router-dom'
import { refsLoader } from 'src/app/lib/rowLoaders/refsLoader.ts'
import { getRowVariables } from 'src/app/lib/utils.ts'
import { NotFoundRow } from 'src/shared/errors/NotFoundRow.ts'
import { IRowModel } from 'src/shared/model/BackendStore'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const baseRowLoader = async (params: Params, revisionId: string): Promise<IRowModel> => {
  const variables = getRowVariables(params, revisionId)

  const row = rootStore.cache.getRowByVariables(variables) || (await rootStore.queryRow(variables))

  if (!row) {
    throw new NotFoundRow(params.rowId)
  }

  if (!rootStore.cache.getRowForeignKeysByVariables(variables)) {
    await rootStore.queryGetRowCountForeignKeysBy(variables)
  }

  await refsLoader(variables) // TODO separate route

  return row
}