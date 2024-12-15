import { makeAutoObservable } from 'mobx'
import { Priority } from 'src/features/RevisionsCard/config/types.ts'
import { MiddleRevisionsFinder } from 'src/features/RevisionsCard/model/MiddleRevisionsFinder.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export const DEFAULT_MAX_ITEMS = 8

export class MiddleRevisions {
  public data: IRevisionModel[] = []

  private currentDefaultMaxItems = DEFAULT_MAX_ITEMS

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly middleRevisionsFinder: MiddleRevisionsFinder,
  ) {
    makeAutoObservable(this)
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  public select({ desiredRevision, priority }: { desiredRevision: IRevisionModel; priority: Priority }) {
    if (this.shouldResetDefaultMaxItems(desiredRevision)) {
      this.resetDefaultMaxItems()
    }

    if (this.isNoChangesForDefaultBranch()) {
      this.data = []
    }

    const result: IRevisionModel[] = []

    if (this.shouldAddMiddleRevisions()) {
      const middleRevisions = this.middleRevisionsFinder.find({
        targetRevision: this.getTargetRevision(desiredRevision),
        priority,
        maxItems: this.currentDefaultMaxItems,
      })
      result.push(...middleRevisions)
    }

    this.data = result
  }

  public resetDefaultMaxItems() {
    this.currentDefaultMaxItems = DEFAULT_MAX_ITEMS
  }

  public increaseMaxItemsForNewRevision() {
    this.currentDefaultMaxItems = DEFAULT_MAX_ITEMS + 1
  }

  private isNoChangesForDefaultBranch(): boolean {
    return !this.branch.parentBranch && this.branch.start === this.branch.head && !this.branch.touched
  }

  private shouldAddMiddleRevisions(): boolean {
    return this.branch.start !== this.branch.head && this.branch.start.child !== this.branch.head
  }

  private getTargetRevision(desiredRevision: IRevisionModel) {
    if (desiredRevision === this.branch.start) {
      return this.branch.start.child!
    }

    if (desiredRevision === this.branch.head || desiredRevision === this.branch.draft) {
      return this.branch.head.parent!
    }

    return desiredRevision
  }

  private shouldResetDefaultMaxItems(desiredRevision: IRevisionModel) {
    return desiredRevision !== this.branch.head
  }
}
