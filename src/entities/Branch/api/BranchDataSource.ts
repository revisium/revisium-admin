import { BranchLoaderFragmentFragment, GetBranchForLoaderQuery } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export type BranchLoaderData = BranchLoaderFragmentFragment

export class BranchDataSource {
  public async getBranch(organizationId: string, projectName: string, branchName: string): Promise<BranchLoaderData> {
    const result: GetBranchForLoaderQuery = await client.getBranchForLoader({
      data: { organizationId, projectName, branchName },
    })

    return result.branch
  }
}

container.register(BranchDataSource, () => new BranchDataSource(), { scope: 'singleton' })
