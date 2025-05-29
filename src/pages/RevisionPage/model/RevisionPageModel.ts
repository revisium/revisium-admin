import { makeAutoObservable } from 'mobx'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor'
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

  public selectForeignKey(item: TableStackModel, node: StringForeignKeyNodeStore) {
    item.toConnectingForeignKeyTable(node)

    this.stack.push(
      new TableStackModel(this.rootStore, this.projectPageModel, {
        type: TableStackModelStateType.List,
        isSelectingForeignKey: true,
      }),
    )
  }

  public onSelectedForeignKey(item: TableStackModel, tableId: string) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    const parentItem = this.stack[foundIndex - 1]

    if (parentItem.state.type === TableStackModelStateType.ConnectingForeignKeyTable) {
      parentItem.state.store.setForeignKeyValue(parentItem.state.foreignKeyNode, tableId)

      if (parentItem.state.previousType === TableStackModelStateType.CreatingTable) {
        parentItem.toCreatingTable()
      } else if (parentItem.state.previousType === TableStackModelStateType.UpdatingTable) {
        parentItem.toUpdatingTableFromConnectingForeignKeyTable()
      }
    }

    this.stack.splice(foundIndex)
  }

  public cancelSelectingForeignKey(item: TableStackModel) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    if (foundIndex !== -1) {
      this.stack.splice(foundIndex + 1)
    }

    if (item.state.type === TableStackModelStateType.ConnectingForeignKeyTable) {
      if (item.state.previousType === TableStackModelStateType.CreatingTable) {
        item.toCreatingTable()
      } else if (item.state.previousType === TableStackModelStateType.UpdatingTable) {
        item.toUpdatingTableFromConnectingForeignKeyTable()
      }
    }
  }

  private createFirstStackItem(): TableStackModel {
    const state: TableStackModelState = {
      type: TableStackModelStateType.List,
      isSelectingForeignKey: false,
    }

    return new TableStackModel(this.rootStore, this.projectPageModel, state)
  }
}
