import { type ForeignKeySearchResult } from '@revisium/schema-toolkit-ui'
import { SearchIn, SearchType } from 'src/__generated__/graphql-request.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { client } from 'src/shared/model/ApiService.ts'

export const createSearchForeignKey = (projectContext: ProjectContext) => {
  return async (tableId: string, search: string): Promise<ForeignKeySearchResult> => {
    const result = await client.findForeignKey({
      data: {
        first: 100,
        revisionId: projectContext.revisionId,
        tableId,
        where: search
          ? {
              OR: [
                { id: { contains: search } },
                { data: { path: [], search, searchType: SearchType.Plain, searchIn: SearchIn.Values } },
              ],
            }
          : undefined,
      },
    })

    return {
      ids: result.rows.edges.map((edge) => edge.node.id),
      hasMore: result.rows.pageInfo.hasNextPage,
    }
  }
}
