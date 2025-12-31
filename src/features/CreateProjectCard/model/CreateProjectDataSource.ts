import { makeAutoObservable } from 'mobx'
import { CreateProjectMutation } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface CreateProjectInput {
  organizationId: string
  projectName: string
  branchName?: string
  fromRevisionId?: string
}

export class CreateProjectDataSource {
  private readonly request = ObservableRequest.of(client.createProject)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public get data(): CreateProjectMutation | null {
    return this.request.data
  }

  public async create(input: CreateProjectInput): Promise<boolean> {
    const result = await this.request.fetch({
      data: {
        organizationId: input.organizationId,
        projectName: input.projectName,
        branchName: input.branchName,
        fromRevisionId: input.fromRevisionId,
      },
    })

    return result.isRight
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(CreateProjectDataSource, () => new CreateProjectDataSource(), { scope: 'request' })
