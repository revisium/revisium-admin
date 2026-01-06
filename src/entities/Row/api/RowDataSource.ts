import {
  GetRowCountForeignKeysToForLoaderQuery,
  GetRowForLoaderQuery,
  RowLoaderFragmentFragment,
} from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export type RowLoaderData = RowLoaderFragmentFragment

export class RowDataSource {
  public async getRow(revisionId: string, tableId: string, rowId: string): Promise<RowLoaderData | null> {
    const result: GetRowForLoaderQuery = await client.getRowForLoader({
      data: { revisionId, tableId, rowId },
    })

    return result.row ?? null
  }

  public async getRowCountForeignKeysTo(revisionId: string, tableId: string, rowId: string): Promise<number> {
    const result: GetRowCountForeignKeysToForLoaderQuery = await client.getRowCountForeignKeysToForLoader({
      data: { revisionId, tableId, rowId },
    })

    return result.row?.countForeignKeysTo ?? 0
  }
}

container.register(RowDataSource, () => new RowDataSource(), { scope: 'singleton' })
