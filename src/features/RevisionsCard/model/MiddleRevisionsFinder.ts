import { Priority } from 'src/features/RevisionsCard/config/types.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'

export type RevisionOptionType = {
  revisionIdOrTag: string
}

export class MiddleRevisionsFinder {
  constructor(private readonly projectPageModel) {}

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  public find({
    targetRevision,
    priority,
    maxItems,
  }: {
    targetRevision: IRevisionModel
    priority: Priority
    maxItems: number
  }) {
    const result: IRevisionModel[] = []

    const { rawRightPartRevisions, rawLeftPartRevisions } = this.getParts({
      targetRevision,
      priority,
      maxItems,
    })

    result.push(...rawLeftPartRevisions)
    result.push(targetRevision)
    result.push(...rawRightPartRevisions)

    return result
  }

  private getParts({
    targetRevision,
    priority,
    maxItems,
  }: {
    targetRevision: IRevisionModel
    maxItems: number
    priority: Priority
  }) {
    const rawLeftPartRevisions = this.getLeftPartRevisions({
      targetRevision,
      maxLength: maxItems + 1,
    })
    const rawRightPartRevisions = this.getRightPartRevisions({
      targetRevision,
      maxLength: maxItems + 1,
    })

    const rawCutLeftPartRevisions: IRevisionModel[] = []
    const rawCutRightPartRevisions: IRevisionModel[] = []

    const rawTempLeftPartRevisions = rawLeftPartRevisions.slice()
    const rawTempRightPartRevisions = rawRightPartRevisions.slice().reverse()

    let counter = 0
    while (counter < maxItems) {
      const leftITem =
        priority === Priority.Right && rawTempRightPartRevisions.length && rawCutLeftPartRevisions.length > 0
          ? undefined
          : rawTempLeftPartRevisions.pop()
      if (leftITem) {
        rawCutLeftPartRevisions.unshift(leftITem)

        counter += 1
      }

      if (counter >= maxItems) {
        break
      }

      const rightItem =
        priority === Priority.Left && rawTempLeftPartRevisions.length && rawCutRightPartRevisions.length > 0
          ? undefined
          : rawTempRightPartRevisions.pop()
      if (rightItem) {
        rawCutRightPartRevisions.push(rightItem)
        counter += 1
      }

      if (!rawTempLeftPartRevisions.length && !rawTempRightPartRevisions.length) {
        break
      }
    }

    return {
      rawLeftPartRevisions: rawCutLeftPartRevisions,
      rawRightPartRevisions: rawCutRightPartRevisions,
    }
  }

  private getLeftPartRevisions({
    targetRevision,
    maxLength,
  }: {
    targetRevision: IRevisionModel
    maxLength: number
  }): IRevisionModel[] {
    const rawPage: IRevisionModel[] = []

    if (targetRevision !== this.branch.start && targetRevision.parent !== this.branch.start) {
      let current = targetRevision.parent

      while (current) {
        if (current !== this.branch.head) {
          rawPage.push(current)
        }
        current = current.parent

        if (this.branch.start === current || rawPage.length >= maxLength) {
          break
        }
      }
    }

    return rawPage.reverse()
  }

  private getRightPartRevisions({
    targetRevision,
    maxLength,
  }: {
    targetRevision: IRevisionModel
    maxLength: number
  }): IRevisionModel[] {
    const rawPage: IRevisionModel[] = []

    if (
      targetRevision !== this.branch.head &&
      targetRevision !== this.branch.draft &&
      targetRevision.child !== this.branch.head
    ) {
      let current = targetRevision.child
      while (current) {
        rawPage.push(current)
        current = current.child

        if (this.branch.head === current || rawPage.length >= maxLength) {
          break
        }
      }
    }

    return rawPage
  }
}
