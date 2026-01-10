import { container } from 'src/shared/lib'
import { RelationEdge } from '../lib/types.ts'
import { RelationEdgeViewModel } from './RelationEdgeViewModel.ts'

export type RelationEdgeViewModelFactoryFn = (data: RelationEdge) => RelationEdgeViewModel

export class RelationEdgeViewModelFactory {
  constructor(public readonly create: RelationEdgeViewModelFactoryFn) {}
}

container.register(
  RelationEdgeViewModelFactory,
  () => {
    return new RelationEdgeViewModelFactory((data) => {
      return new RelationEdgeViewModel(data)
    })
  },
  { scope: 'request' },
)
