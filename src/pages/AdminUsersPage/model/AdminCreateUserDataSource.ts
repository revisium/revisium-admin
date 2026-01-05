import { makeAutoObservable } from 'mobx'
import { UserSystemRole } from 'src/__generated__/graphql-request'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { client } from 'src/shared/model/ApiService'

export interface CreateUserInput {
  username: string
  password: string
  email?: string
  roleId: UserSystemRole
}

export class AdminCreateUserDataSource {
  private readonly request = ObservableRequest.of(client.createUser)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public async create(input: CreateUserInput): Promise<boolean> {
    const result = await this.request.fetch({
      username: input.username,
      password: input.password,
      email: input.email,
      roleId: input.roleId,
    })

    return result.isRight && result.data.createUser
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(AdminCreateUserDataSource, () => new AdminCreateUserDataSource(), { scope: 'request' })
