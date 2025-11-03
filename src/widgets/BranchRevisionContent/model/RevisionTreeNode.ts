import { format } from 'date-fns/format'
import { FindRevisionFragment } from 'src/__generated__/graphql-request.ts'
import { RevisionEndpointPopoverModel } from 'src/features/RevisionEndpointPopover'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'

export class RevisionTreeNode {
  public isOpenEndpointPopover: boolean = false

  private linkMaker: LinkMaker
  private _popover: RevisionEndpointPopoverModel | null = null

  constructor(
    private readonly revision: FindRevisionFragment,
    private readonly projectPageModel: ProjectPageModel,
  ) {
    this.linkMaker = new LinkMaker(projectPageModel)

    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get popover() {
    if (!this._popover) {
      this._popover = new RevisionEndpointPopoverModel(this.projectPageModel, this.revision)
    }

    return this._popover
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
    return this.revision.id === this.projectPageModel.revisionOrThrow.id
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
      return this.linkMaker.make({ isDraft: true })
    }

    if (this.isHead) {
      return this.linkMaker.make({ isHead: true })
    }

    return this.linkMaker.make({ id: this.revision.id })
  }

  public setIsOpenEndpointPopover(value: boolean) {
    this.isOpenEndpointPopover = value
  }
}
