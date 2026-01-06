import { createStackContext } from 'src/shared/lib/Stack'
import { TableStackItem } from './TableStackItem.ts'
import { TableStackManager } from './TableStackManager.ts'

export const { Context: TableStackContext, useStackModel: useTableStackModel } = createStackContext<
  TableStackManager,
  TableStackItem
>()
