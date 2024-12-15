import { makeAutoObservable } from 'mobx'
import { IconType } from 'src/features/RevisionsCard/config/icons.ts'
import { IRevisionCardItem } from 'src/features/RevisionsCard/config/types.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'

export class RevisionCardPreviousItemModel implements IRevisionCardItem {
  public index = 0

  constructor(private readonly revision: IRevisionModel) {
    makeAutoObservable(this)
  }

  public get id() {
    return this.revision.id
  }

  public get children() {
    return []
  }

  public get disabled() {
    return false
  }

  public get icon() {
    return IconType.PreviousPage
  }

  public get dataTestId() {
    return 'revision-previous-page'
  }

  public get link() {
    return ''
  }

  public get tooltip() {
    return [`Previous page`]
  }

  public get hidden() {
    return false
  }
}
