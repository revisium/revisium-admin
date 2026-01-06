import { TableListItem } from './TableListItem.ts'
import { TableCreatingItem } from './TableCreatingItem.ts'
import { TableUpdatingItem } from './TableUpdatingItem.ts'

export { TableStackItemBase, type TableStackItemBaseDeps } from './TableStackItemBase.ts'
export { TableEditorItemBase } from './TableEditorItemBase.ts'
export { TableListItem } from './TableListItem.ts'
export { TableCreatingItem, type TableCreatingItemDeps } from './TableCreatingItem.ts'
export { TableUpdatingItem, type TableUpdatingItemDeps } from './TableUpdatingItem.ts'

export type TableStackItem = TableListItem | TableCreatingItem | TableUpdatingItem
export type TableEditorItem = TableCreatingItem | TableUpdatingItem
