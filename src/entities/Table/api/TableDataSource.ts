import { GetTableForLoaderQuery, TableLoaderFragmentFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export type TableLoaderData = TableLoaderFragmentFragment

export class TableDataSource {
  public async getTable(revisionId: string, tableId: string): Promise<TableLoaderData | null> {
    const result: GetTableForLoaderQuery = await client.getTableForLoader({
      data: { revisionId, tableId },
    })

    return result.table ?? null
  }
}

container.register(TableDataSource, () => new TableDataSource(), { scope: 'singleton' })
