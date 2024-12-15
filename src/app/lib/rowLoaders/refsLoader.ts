import { rootStore } from 'src/shared/model/RootStore.ts'

export const refsLoader = async (variables: { revisionId: string; tableId: string; rowId: string }) => {
  await rootStore.queryTableReferencesBy({
    data: {
      revisionId: variables.revisionId,
      tableId: variables.tableId,
    },
    referenceData: {
      first: 100, // TODO lazy + fetch more
    },
  })

  const table = rootStore.cache.getTableByVariables({ revisionId: variables.revisionId, tableId: variables.tableId })

  for (const edge of table?.referencesByConnection.edges || []) {
    await rootStore.queryRowReferencesBy({
      data: variables,
      referenceData: {
        first: 100, // TODO lazy + fetch more
        referenceTableId: edge.node.id,
      },
    })
  }
}
