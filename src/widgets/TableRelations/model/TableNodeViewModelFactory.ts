import { container } from 'src/shared/lib'
import { LayoutNode } from '../lib/types.ts'
import { TableNodeViewModel } from './TableNodeViewModel.ts'

export type TableNodeViewModelFactoryFn = (data: LayoutNode) => TableNodeViewModel

export class TableNodeViewModelFactory {
  constructor(public readonly create: TableNodeViewModelFactoryFn) {}
}

container.register(
  TableNodeViewModelFactory,
  () => {
    return new TableNodeViewModelFactory((data) => {
      return new TableNodeViewModel(data)
    })
  },
  { scope: 'request' },
)
