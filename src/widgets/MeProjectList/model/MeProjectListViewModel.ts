import { MeProjectListItemFragment } from 'src/__generated__/graphql-request.ts'
import { container, PaginatedListViewModel } from 'src/shared/lib'
import { MeProjectsDataSource } from './MeProjectsDataSource.ts'
import { MeProjectListItemViewModel } from './MeProjectListItemViewModel.ts'

export class MeProjectListViewModel extends PaginatedListViewModel<
  MeProjectListItemFragment,
  MeProjectListItemViewModel
> {
  protected getItemKey(item: MeProjectListItemFragment): string {
    return item.id
  }

  protected createItemViewModel(item: MeProjectListItemFragment): MeProjectListItemViewModel {
    return new MeProjectListItemViewModel(item)
  }
}

container.register(
  MeProjectListViewModel,
  () => {
    const dataSource = container.get(MeProjectsDataSource)
    return new MeProjectListViewModel(dataSource)
  },
  { scope: 'request' },
)
