import { rootStore } from 'src/shared/model/RootStore.ts'

export const refsLoader = async (variables: { revisionId: string; tableId: string; rowId: string }) => {
  await rootStore.queryTableForeignKeysBy({
    data: {
      revisionId: variables.revisionId,
      tableId: variables.tableId,
    },
    foreignKeyData: {
      first: 100, // TODO lazy + fetch more
    },
  })

  const table = rootStore.cache.getTableByVariables({ revisionId: variables.revisionId, tableId: variables.tableId })

  for (const edge of table?.foreignKeysByConnection.edges || []) {
    await rootStore.queryRowForeignKeysBy({
      data: variables,
      foreignKeyData: {
        first: 100, // TODO lazy + fetch more
        foreignKeyTableId: edge.node.id,
      },
    })
  }
}
