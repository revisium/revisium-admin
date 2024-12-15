import { makeAutoObservable } from 'mobx'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'
import {
  TableStackModel,
  TableStackModelState,
  TableStackModelStateType,
} from 'src/pages/RevisionPage/model/TableStackModel.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevisionPageModel {
  public stack: [TableStackModel] & TableStackModel[]

  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.stack = [this.createFirstStackItem()]
  }

  public init() {}

  public dispose() {}

  public selectReference(item: TableStackModel, node: StringReferenceNodeStore) {
    item.toConnectingReferenceTable(node)

    this.stack.push(
      new TableStackModel(this.rootStore, this.projectPageModel, {
        type: TableStackModelStateType.List,
        isSelectingReference: true,
      }),
    )
  }

  public onSelectedReference(item: TableStackModel, tableId: string) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    const parentItem = this.stack[foundIndex - 1]

    if (parentItem.state.type === TableStackModelStateType.ConnectingReferenceTable) {
      parentItem.state.store.setReferenceValue(parentItem.state.referenceNode, tableId)

      if (parentItem.state.previousType === TableStackModelStateType.CreatingTable) {
        parentItem.toCreatingTable()
      } else if (parentItem.state.previousType === TableStackModelStateType.UpdatingTable) {
        parentItem.toUpdatingTableFromConnectingReferenceTable()
      }
    }

    this.stack.splice(foundIndex)
  }

  public cancelSelectingReference(item: TableStackModel) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    if (foundIndex !== -1) {
      this.stack.splice(foundIndex + 1)
    }

    if (item.state.type === TableStackModelStateType.ConnectingReferenceTable) {
      if (item.state.previousType === TableStackModelStateType.CreatingTable) {
        item.toCreatingTable()
      } else if (item.state.previousType === TableStackModelStateType.UpdatingTable) {
        item.toUpdatingTableFromConnectingReferenceTable()
      }
    }
  }

  private createFirstStackItem(): TableStackModel {
    const state: TableStackModelState = {
      type: TableStackModelStateType.List,
      isSelectingReference: false,
    }

    return new TableStackModel(this.rootStore, this.projectPageModel, state)
  }
}
