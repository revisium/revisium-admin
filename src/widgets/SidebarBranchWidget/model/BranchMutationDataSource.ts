import { container, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export interface RevertChangesParams {
  organizationId: string
  projectName: string
  branchName: string
}

export interface CreateRevisionParams {
  organizationId: string
  projectName: string
  branchName: string
  comment: string
}

export interface CreateBranchParams {
  revisionId: string
  branchName: string
}

export class BranchMutationDataSource {
  private readonly revertRequest = ObservableRequest.of(client.revertChangesForSidebar)
  private readonly createRevisionRequest = ObservableRequest.of(client.createRevisionForSidebar)
  private readonly createBranchRequest = ObservableRequest.of(client.createBranchForSidebar)

  public async revertChanges(params: RevertChangesParams): Promise<boolean> {
    const result = await this.revertRequest.fetch({
      data: {
        organizationId: params.organizationId,
        projectName: params.projectName,
        branchName: params.branchName,
      },
    })

    return result.isRight
  }

  public async createRevision(params: CreateRevisionParams): Promise<boolean> {
    const result = await this.createRevisionRequest.fetch({
      data: {
        organizationId: params.organizationId,
        projectName: params.projectName,
        branchName: params.branchName,
        comment: params.comment,
      },
    })

    return result.isRight
  }

  public async createBranch(params: CreateBranchParams): Promise<boolean> {
    const result = await this.createBranchRequest.fetch({
      data: {
        revisionId: params.revisionId,
        branchName: params.branchName,
      },
    })

    return result.isRight
  }

  public dispose(): void {
    this.revertRequest.abort()
    this.createRevisionRequest.abort()
    this.createBranchRequest.abort()
  }
}

container.register(BranchMutationDataSource, () => new BranchMutationDataSource(), { scope: 'request' })
