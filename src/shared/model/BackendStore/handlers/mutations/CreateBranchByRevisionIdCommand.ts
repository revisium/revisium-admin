import { createBranchByRevisionIdMstRequest } from 'src/shared/model/BackendStore/api/createBranchByRevisionIdMstRequest.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { addBranchFragmentToCache } from 'src/shared/model/BackendStore/utils/addBranchFragmentToCache.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export class CreateBranchByRevisionIdCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    private readonly branchName: string,
  ) {}

  private get organization() {
    return this.projectPageModel.organization
  }

  private get project() {
    return this.projectPageModel.project
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public async execute() {
    const branch = await this.createBranchByRevisionIdRequest()

    await Promise.all([this.refetchBranchesConnection(), this.refetchRevision()])

    return branch
  }

  private async createBranchByRevisionIdRequest() {
    const result = await createBranchByRevisionIdMstRequest({
      data: { revisionId: this.revision.id, branchName: this.branchName },
    })

    return addBranchFragmentToCache(this.rootStore.cache, result.createBranchByRevisionId)
  }

  private async refetchBranchesConnection() {
    await rootStore.backend.queryBranches({
      organizationId: this.organization.id,
      projectName: this.project.name,
      first: 100,
    })
  }

  private async refetchRevision() {
    await rootStore.backend.queryRevision({
      revisionId: this.revision.id,
    })
  }
}
