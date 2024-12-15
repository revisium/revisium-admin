import { LoaderFunction } from 'react-router-dom'
import { waitForBranch } from 'src/app/lib/utils.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const draftRevisionLoader: LoaderFunction = async ({ params }) => {
  const branch = await waitForBranch(params)

  const revision = branch.draft

  if (revision.tablesConnection.countLoaded === 0) {
    await rootStore.queryTables({
      revisionId: revision.id,
      first: 50,
    })
  }

  return revision
}
