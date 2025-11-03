import { format } from 'date-fns'
import { makeAutoObservable } from 'mobx'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { IconType } from 'src/features/RevisionsCard/config/icons.ts'
import { IRevisionCardItem } from 'src/features/RevisionsCard/config/types.ts'
import { RevisionCardChildItemModel } from 'src/features/RevisionsCard/model/items/RevisionCardChildItemModel.ts'
import { RevisionOptionType } from 'src/features/RevisionsCard/model/MiddleRevisionsFinder.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevisionCardItemModel implements IRevisionCardItem {
  public index = 0

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly linkMaker: LinkMaker,
    private readonly revision: IRevisionModel,
  ) {
    makeAutoObservable(this)
  }

  public get id() {
    return this.revision.id
  }

  public get isThereEndpoint() {
    return Boolean(this.revision.endpoints.length)
  }

  public get children() {
    return this.revision.childBranches.map(
      (childBranch) => new RevisionCardChildItemModel(this.projectPageModel, childBranch),
    )
  }

  public get disabled() {
    return this.revision.id === this.projectPageModel.revisionOrThrow.id
  }

  public get icon() {
    if (this.checkIsHeadRevision()) {
      return IconType.Head
    } else if (this.checkIsStartRevision()) {
      return IconType.Start
    } else if (this.checkIsDraftRevision()) {
      return IconType.Draft
    } else {
      return IconType.Revision
    }
  }

  public get dataTestId() {
    if (this.checkIsHeadRevision()) {
      return 'revision-head'
    } else if (this.checkIsStartRevision()) {
      return 'revision-start'
    } else if (this.checkIsDraftRevision()) {
      return 'revision-draft'
    } else {
      return `revision_index_${this.index}`
    }
  }

  public get link() {
    return this.linkMaker.make(this.revisionLinkOption)
  }

  public get tooltip() {
    if (this.checkIsDraftRevision()) {
      return ['Draft revision']
    }

    const comment = this.revision.comment ? [this.revision.comment] : []
    const date = format(new Date(this.revision.createdAt), 'dd MMM yyyy, HH:mm:ss')

    const tooltips = [...comment, this.revision.id, date]

    const endpoints = this.revision.endpoints.map((endpoint) => `${endpoint.type}`)
    if (endpoints.length) {
      tooltips.push(''.padEnd(25, '-'))
      tooltips.push('Active endpoints:')
      tooltips.push(endpoints.join(', '))
    }

    if (this.checkIsHeadRevision()) {
      tooltips.unshift(`Head revision:`)
    }

    if (this.checkIsStartRevision()) {
      tooltips.unshift(`Init revision:`)
    }

    return tooltips
  }

  public get hidden() {
    return false
  }

  private get revisionLinkOption(): RevisionOptionType {
    if (this.checkIsHeadRevision()) {
      return { isHead: true }
    }

    if (this.checkIsDraftRevision()) {
      return { isDraft: true }
    }

    return { id: this.revision.id }
  }

  private checkIsStartRevision() {
    return this.projectPageModel.branchOrThrow.start.id === this.revision.id
  }

  private checkIsDraftRevision() {
    return this.projectPageModel.branchOrThrow.draft.id === this.revision.id
  }

  private checkIsHeadRevision() {
    return this.projectPageModel.branchOrThrow.head.id === this.revision.id
  }
}
