import { makeAutoObservable } from 'mobx'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { IRevisionCardItem } from 'src/features/RevisionsCard/config/types.ts'
import { RevisionCardItemModel } from 'src/features/RevisionsCard/model/items/RevisionCardItemModel.ts'
import { RevisionCardNextItemModel } from 'src/features/RevisionsCard/model/items/RevisionCardNextItemModel.ts'
import { RevisionCardParentItemModel } from 'src/features/RevisionsCard/model/items/RevisionCardParentItemModel.ts'
import { RevisionCardPreviousItemModel } from 'src/features/RevisionsCard/model/items/RevisionCardPreviousItemModel.ts'
import { MiddleRevisions } from 'src/features/RevisionsCard/model/MiddleRevisions.ts'
import { IParentBranch, IRevisionModel } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevisionsCardItemsModel {
  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly linkMaker: LinkMaker,
    private readonly middleRevisions: MiddleRevisions,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get items() {
    const result: IRevisionCardItem[] = []

    if (this.branch.parentBranch) {
      result.push(this.createParentBranchItem(this.branch.parentBranch))
    }

    if (this.shouldAddStartRevision()) {
      result.push(this.createStartItem())
    }

    const middleRevisions = this.middleRevisions.data.slice()
    const firstMiddleRevision = middleRevisions.shift()
    const lastMiddleRevision = middleRevisions.pop()

    if (firstMiddleRevision) {
      result.push(this.createFirstMiddleItem(firstMiddleRevision))
    }

    for (const revision of middleRevisions) {
      result.push(this.createMiddleItem(revision))
    }

    if (lastMiddleRevision) {
      result.push(this.createLastMiddleItem(lastMiddleRevision))
    }

    result.push(this.createHeadItem())

    if (this.branch.touched) {
      result.push(this.createDraftItem())
    }

    if (result.length === 1 && !this.branch.head.tablesConnection.totalCount) {
      return []
    }

    result.forEach((item, index) => {
      item.index = index
    })

    return result
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private createParentBranchItem(parentBranch: IParentBranch) {
    return new RevisionCardParentItemModel(this.projectPageModel, parentBranch)
  }

  private createStartItem() {
    return new RevisionCardItemModel(this.projectPageModel, this.linkMaker, this.branch.start)
  }

  private createFirstMiddleItem(revision: IRevisionModel) {
    if (revision.parent === this.branch.start) {
      return new RevisionCardItemModel(this.projectPageModel, this.linkMaker, revision)
    } else {
      return new RevisionCardPreviousItemModel(revision)
    }
  }

  private createMiddleItem(revision: IRevisionModel) {
    return new RevisionCardItemModel(this.projectPageModel, this.linkMaker, revision)
  }

  private createLastMiddleItem(revision: IRevisionModel) {
    if (revision.child === this.branch.head) {
      return new RevisionCardItemModel(this.projectPageModel, this.linkMaker, revision)
    } else {
      return new RevisionCardNextItemModel(revision)
    }
  }

  private createHeadItem() {
    return new RevisionCardItemModel(this.projectPageModel, this.linkMaker, this.branch.head)
  }

  private createDraftItem() {
    return new RevisionCardItemModel(this.projectPageModel, this.linkMaker, this.branch.draft)
  }

  private shouldAddStartRevision(): boolean {
    return this.branch.start !== this.branch.head
  }
}
