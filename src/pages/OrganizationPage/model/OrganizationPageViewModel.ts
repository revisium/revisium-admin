import { action, computed, observable, makeObservable } from 'mobx'
import { OrganizationProjectItemFragment } from 'src/__generated__/graphql-request.ts'
import { container, PaginatedListViewModel } from 'src/shared/lib'
import { PermissionService } from 'src/shared/model/AbilityService'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { OrganizationProjectsDataSource } from './OrganizationProjectsDataSource.ts'
import { OrganizationProjectItemViewModel } from './OrganizationProjectItemViewModel.ts'

export class OrganizationPageViewModel extends PaginatedListViewModel<
  OrganizationProjectItemFragment,
  OrganizationProjectItemViewModel
> {
  public isCreatingProject = false

  constructor(
    dataSource: OrganizationProjectsDataSource,
    private readonly permissionService: PermissionService,
    private readonly context: OrganizationContext,
  ) {
    super(dataSource)
    makeObservable(this, {
      isCreatingProject: observable,
      canCreateProject: computed,
      toggleCreatingProject: action.bound,
      handleProjectCreated: action.bound,
    })
  }

  public get canCreateProject(): boolean {
    return this.permissionService.can('create', 'Project', { organizationId: this.context.organizationId })
  }

  protected getItemKey(item: OrganizationProjectItemFragment): string {
    return item.id
  }

  protected createItemViewModel(item: OrganizationProjectItemFragment): OrganizationProjectItemViewModel {
    return new OrganizationProjectItemViewModel(item)
  }

  public toggleCreatingProject(): void {
    this.isCreatingProject = !this.isCreatingProject
  }

  public handleProjectCreated(): void {
    this.isCreatingProject = false
    this.init()
  }
}

container.register(
  OrganizationPageViewModel,
  () => {
    const dataSource = container.get(OrganizationProjectsDataSource)
    const permissionService = container.get(PermissionService)
    const context = container.get(OrganizationContext)
    return new OrganizationPageViewModel(dataSource, permissionService, context)
  },
  { scope: 'request' },
)
