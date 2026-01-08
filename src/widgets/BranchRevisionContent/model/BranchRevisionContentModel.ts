import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export class BranchRevisionContentModel {
  constructor(private readonly context: ProjectContext) {}

  public get revisionsTitle() {
    return `Revisions [${this.context.branchName}]`
  }

  public init() {}

  public dispose() {}
}

container.register(
  BranchRevisionContentModel,
  () => {
    const context = container.get(ProjectContext)

    return new BranchRevisionContentModel(context)
  },
  { scope: 'request' },
)
