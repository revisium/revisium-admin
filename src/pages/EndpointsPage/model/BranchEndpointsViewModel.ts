import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { EndpointType } from 'src/__generated__/graphql-request'
import { BranchWithRevisions } from '../api/EndpointsDataSource.ts'
import { EndpointCardViewModel, EndpointCardViewModelFactory } from './EndpointCardViewModel.ts'

export type BranchEndpointsViewModelFactoryFn = (
  branch: BranchWithRevisions,
  endpointType: EndpointType,
  draftEndpointId: string | null,
  headEndpointId: string | null,
  onChanged: () => void,
) => BranchEndpointsViewModel

export class BranchEndpointsViewModelFactory {
  constructor(public readonly create: BranchEndpointsViewModelFactoryFn) {}
}

export class BranchEndpointsViewModel {
  public readonly draftCard: EndpointCardViewModel
  public readonly headCard: EndpointCardViewModel

  constructor(
    endpointCardFactory: EndpointCardViewModelFactory,
    branch: BranchWithRevisions,
    endpointType: EndpointType,
    draftEndpointId: string | null,
    headEndpointId: string | null,
    onChanged: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.draftCard = endpointCardFactory.create(
      {
        branchId: branch.id,
        branchName: branch.name,
        isRootBranch: branch.isRoot,
        revisionId: branch.draftRevisionId,
        revisionType: 'draft',
        endpointType,
        endpointId: draftEndpointId,
      },
      onChanged,
    )

    this.headCard = endpointCardFactory.create(
      {
        branchId: branch.id,
        branchName: branch.name,
        isRootBranch: branch.isRoot,
        revisionId: branch.headRevisionId,
        revisionType: 'head',
        endpointType,
        endpointId: headEndpointId,
      },
      onChanged,
    )
  }

  public get branchId(): string {
    return this.draftCard.branchId
  }

  public get branchName(): string {
    return this.draftCard.branchName
  }

  public get isRootBranch(): boolean {
    return this.draftCard.isRootBranch
  }
}

container.register(
  BranchEndpointsViewModelFactory,
  () => {
    return new BranchEndpointsViewModelFactory((branch, endpointType, draftEndpointId, headEndpointId, onChanged) => {
      const endpointCardFactory = container.get(EndpointCardViewModelFactory)
      return new BranchEndpointsViewModel(
        endpointCardFactory,
        branch,
        endpointType,
        draftEndpointId,
        headEndpointId,
        onChanged,
      )
    })
  },
  { scope: 'request' },
)
