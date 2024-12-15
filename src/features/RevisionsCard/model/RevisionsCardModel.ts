import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx'
import { Priority } from 'src/features/RevisionsCard/config/types.ts'
import { MiddleRevisions } from 'src/features/RevisionsCard/model/MiddleRevisions.ts'
import { RevisionPageQueries } from 'src/features/RevisionsCard/model/RevisionPageQueries.ts'
import { RevisionsCardItemsModel } from 'src/features/RevisionsCard/model/RevisionsCardItemsModel.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevisionsCardModel {
  private disposers: IReactionDisposer[] = []

  constructor(
    private readonly cache: ICacheModel,
    private readonly projectPageModel: ProjectPageModel,
    private readonly revisionsCardItemsModel: RevisionsCardItemsModel,
    private readonly middleRevisions: MiddleRevisions,
    private readonly revisionsPageQueries: RevisionPageQueries,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.updateWithDesiredCurrentRevision()
  }

  public get items() {
    return this.revisionsCardItemsModel.items
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public init() {
    this.middleRevisions.resetDefaultMaxItems()

    this.disposers.push(reaction(() => this.projectPageModel.branch, this.onSelectBranch))
    this.disposers.push(reaction(() => this.projectPageModel.branch?.head, this.onCreatedNewRevision))
    this.disposers.push(reaction(() => this.projectPageModel.revision, this.onSelectRevision))
  }

  public dispose() {
    for (const dispose of this.disposers) {
      dispose()
    }

    this.disposers = []
  }

  public async previousPage(revisionId: string): Promise<void> {
    const revision = this.cache.revision.get(revisionId)?.child

    if (!revision) {
      throw new Error(`Not found revision ${revisionId}`)
    }

    await this.revisionsPageQueries.queryPreviousPage(revision)

    this.middleRevisions.select({
      desiredRevision: revision,
      priority: Priority.Left,
    })
  }

  public async nextPage(revisionId: string): Promise<void> {
    const revision = this.cache.revision.get(revisionId)?.parent

    if (!revision) {
      throw new Error(`Not found revision ${revisionId}`)
    }

    await this.revisionsPageQueries.queryNextPage(revision)

    this.middleRevisions.select({
      desiredRevision: revision,
      priority: Priority.Right,
    })
  }

  private updateWithDesiredCurrentRevision() {
    this.middleRevisions.select({
      desiredRevision: this.revision,
      priority: Priority.None,
    })
  }

  private onSelectBranch() {
    this.dispose()
    this.init()
    this.updateWithDesiredCurrentRevision()
  }

  private onCreatedNewRevision() {
    this.middleRevisions.increaseMaxItemsForNewRevision()
    this.middleRevisions.select({
      desiredRevision: this.branch.head,
      priority: Priority.None,
    })
  }

  private onSelectRevision(nextRevision: IRevisionModel | null) {
    const isEdgeBranch =
      nextRevision === this.branch.start || nextRevision === this.branch.head || nextRevision === this.branch.draft

    if (isEdgeBranch) {
      this.middleRevisions.select({
        desiredRevision: nextRevision,
        priority: Priority.None,
      })
    }
  }
}
