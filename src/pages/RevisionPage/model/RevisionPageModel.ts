import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor'
import {
  TableStackModel,
  TableStackModelState,
  TableStackModelStateType,
} from 'src/pages/RevisionPage/model/TableStackModel.ts'

export class RevisionPageModel {
  public stack: [TableStackModel] & TableStackModel[]

  constructor(private readonly projectContext: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.stack = [this.createFirstStackItem()]
  }

  public init() {}

  public dispose() {
    this.stack.forEach((item) => item.dispose())
  }

  public selectForeignKey(item: TableStackModel, node: StringForeignKeyNodeStore) {
    item.toConnectingForeignKeyTable(node)

    this.stack.push(
      new TableStackModel(this.projectContext, {
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

    const removed = this.stack.splice(foundIndex)
    removed.forEach((removedItem) => removedItem.dispose())
  }

  public cancelSelectingForeignKey(item: TableStackModel) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    if (foundIndex !== -1) {
      const removed = this.stack.splice(foundIndex + 1)
      removed.forEach((removedItem) => removedItem.dispose())
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

    return new TableStackModel(this.projectContext, state)
  }
}

container.register(
  RevisionPageModel,
  () => {
    const projectContext = container.get(ProjectContext)
    return new RevisionPageModel(projectContext)
  },
  { scope: 'request' },
)
