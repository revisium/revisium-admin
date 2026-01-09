import { format } from 'date-fns/format'
import { makeAutoObservable } from 'mobx'
import { FindRevisionFragment } from 'src/__generated__/graphql-request.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { showNavigationToast } from 'src/widgets/BranchRevisionContent/lib/showNavigationToast.ts'

export class RevisionTreeNode {
  private readonly linkMaker: LinkMaker

  constructor(
    private readonly revision: FindRevisionFragment,
    private readonly context: ProjectContext,
  ) {
    this.linkMaker = container.get(LinkMaker)

    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return this.revision.id
  }

  public get shortId(): string {
    return `[${this.revision.id.slice(0, 3)}]`
  }

  public get revisionModel(): FindRevisionFragment {
    return this.revision
  }

  public get comment(): string | null {
    return this.revision.comment
  }

  public get isDraft(): boolean {
    return this.revision.isDraft
  }

  public get isHead(): boolean {
    return this.revision.isHead
  }

  public get isStart(): boolean {
    return this.revision.isStart
  }

  public get isActive(): boolean {
    return this.revision.id === this.context.revisionId
  }

  public get badgeText(): string | null {
    if (this.isDraft) return 'draft'
    if (this.isHead) return 'head'
    return null
  }

  public get formattedDate(): string | null {
    if (this.isDraft) return null

    return format(new Date(this.revision.createdAt), 'dd.MM.yyyy, HH:mm')
  }

  public get link(): string {
    if (this.isDraft) {
      return this.linkMaker.makeRevisionLink({ revisionIdOrTag: DRAFT_TAG })
    }
    if (this.isHead) {
      return this.linkMaker.makeRevisionLink({ revisionIdOrTag: HEAD_TAG })
    }
    return this.linkMaker.makeRevisionLink({ revisionIdOrTag: this.revision.id })
  }

  public get branchName(): string {
    return this.context.branchName
  }

  private get toastPath(): string {
    const branchName = this.branchName
    if (this.isDraft) {
      return `${branchName} / ${DRAFT_TAG}`
    }
    if (this.isHead) {
      return `${branchName} / ${HEAD_TAG}`
    }
    return `${branchName} / ${this.shortId}`
  }

  private get isReadonly(): boolean {
    return !this.isDraft
  }

  public showNavigationToast(): void {
    if (this.isActive) return
    showNavigationToast({
      path: this.toastPath,
      isReadonly: this.isReadonly,
    })
  }
}
