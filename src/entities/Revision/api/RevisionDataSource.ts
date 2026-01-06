import { GetRevisionForLoaderQuery } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export type RevisionLoaderData = { id: string }

export class RevisionDataSource {
  public async getRevision(revisionId: string): Promise<RevisionLoaderData> {
    const result: GetRevisionForLoaderQuery = await client.getRevisionForLoader({
      data: { revisionId },
    })

    return result.revision
  }
}

container.register(RevisionDataSource, () => new RevisionDataSource(), { scope: 'singleton' })
