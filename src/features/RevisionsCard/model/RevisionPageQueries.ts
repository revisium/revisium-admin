import { makeAutoObservable } from 'mobx'
import { GetBranchInput } from 'src/__generated__/globalTypes.ts'
import { COUNT_REVISIONS_TO_BE_LOADED } from 'src/shared/config/countRevisionsToBeLoaded.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export class RevisionPageQueries {
  constructor(private readonly projectPageModel: ProjectPageModel) {
    makeAutoObservable(this)
  }

  public async queryNextPage(revision: IRevisionModel) {
    const childrenDetails = revision.getChildrenDetails(COUNT_REVISIONS_TO_BE_LOADED)
    if (!childrenDetails.isAllLoaded) {
      await rootStore.queryRevisions({
        branch: this.branchVariables,
        revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, after: revision.id },
      })
    }
  }

  public async queryPreviousPage(revision: IRevisionModel) {
    const parentDetails = revision.getParentsDetails(COUNT_REVISIONS_TO_BE_LOADED)
    if (!parentDetails.isAllLoaded) {
      await rootStore.queryRevisions({
        branch: this.branchVariables,
        revisions: { first: COUNT_REVISIONS_TO_BE_LOADED, before: revision.id },
      })
    }
  }

  private get branchVariables(): GetBranchInput {
    return {
      organizationId: this.projectPageModel.organization.id,
      projectName: this.projectPageModel.project.name,
      branchName: this.projectPageModel.branchOrThrow.name,
    }
  }
}
