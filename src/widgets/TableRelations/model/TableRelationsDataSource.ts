import { TableRelationsDataQuery, TableRelationsItemFragment } from 'src/__generated__/graphql-request.ts'
import { JsonSchema } from 'src/entities/Schema/types/schema.types.ts'
import { container, isAborted } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { TableWithSchema } from '../lib/types.ts'

export class TableRelationsDataSource {
  private readonly request = ObservableRequest.of(client.tableRelationsData)

  public async load(revisionId: string): Promise<{ tables: TableWithSchema[] | null; aborted: boolean }> {
    const result = await this.request.fetch({
      data: {
        revisionId,
        first: 1000,
      },
    })

    if (!result.isRight) {
      return { tables: null, aborted: isAborted(result) }
    }

    return { tables: this.mapToTableWithSchema(result.data), aborted: false }
  }

  public dispose(): void {
    this.request.abort()
  }

  private mapToTableWithSchema(data: TableRelationsDataQuery): TableWithSchema[] {
    return data.tables.edges.map((edge) => this.mapItem(edge.node))
  }

  private mapItem(item: TableRelationsItemFragment): TableWithSchema {
    return {
      id: item.id,
      count: item.count,
      schema: item.schema as JsonSchema,
    }
  }
}

container.register(TableRelationsDataSource, () => new TableRelationsDataSource(), { scope: 'request' })
