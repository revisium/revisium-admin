import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx'
import { NavigateFunction } from 'react-router-dom'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class DraftHeadWatcher {
  private disposer: IReactionDisposer | null = null

  constructor(
    private readonly navigateFunction: NavigateFunction,
    private readonly linkMaker: LinkMaker,
    private projectPageModel: ProjectPageModel,
  ) {
    makeAutoObservable(this)
  }

  public toDraftRoute() {
    this.navigateFunction?.(this.linkMaker.make({ isDraft: true }))
  }

  public toHeadRoute() {
    this.navigateFunction?.(this.linkMaker.make({ isHead: true }))
  }

  public init() {
    this.listenToBranch()
  }

  public dispose() {
    this.disposer?.()
    this.disposer = null
  }

  private listenToBranch() {
    this.disposer = reaction(
      () => {
        return {
          branch: this.branch,
          touched: this.branch.touched,
        }
      },
      (nextValue, previousValues) => {
        if (nextValue.branch && previousValues.branch && nextValue.branch.id === previousValues.branch.id) {
          if (nextValue.branch.touched) {
            this.toDraftRoute()
          } else {
            this.toHeadRoute()
          }
        }
      },
    )
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }
}
