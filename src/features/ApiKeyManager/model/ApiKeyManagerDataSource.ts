import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export class ApiKeyManagerDataSource {
  public readonly myKeysRequest = ObservableRequest.of(client.myApiKeys, { skipResetting: true })
  public readonly serviceKeysRequest = ObservableRequest.of(client.serviceApiKeys, { skipResetting: true })
  private readonly createPersonalRequest = ObservableRequest.of(client.createPersonalApiKey)
  private readonly createServiceRequest = ObservableRequest.of(client.createServiceApiKey)
  private readonly revokeRequest = ObservableRequest.of(client.revokeApiKey)
  private readonly rotateRequest = ObservableRequest.of(client.rotateApiKey)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.myKeysRequest.isLoading || this.serviceKeysRequest.isLoading
  }

  public get error(): string | null {
    return this.myKeysRequest.errorMessage ?? this.serviceKeysRequest.errorMessage ?? null
  }

  public get isMutating(): boolean {
    return (
      this.createPersonalRequest.isLoading ||
      this.createServiceRequest.isLoading ||
      this.revokeRequest.isLoading ||
      this.rotateRequest.isLoading
    )
  }

  public fetchPersonalKeys() {
    return this.myKeysRequest.fetch()
  }

  public fetchServiceKeys(organizationId: string) {
    return this.serviceKeysRequest.fetch({ organizationId })
  }

  public async createPersonalKey(data: Parameters<typeof client.createPersonalApiKey>[0]['data']) {
    const result = await this.createPersonalRequest.fetch({ data })
    if (result.isRight) {
      return result.data.createPersonalApiKey
    }
    return null
  }

  public async createServiceKey(data: Parameters<typeof client.createServiceApiKey>[0]['data']) {
    const result = await this.createServiceRequest.fetch({ data })
    if (result.isRight) {
      return result.data.createServiceApiKey
    }
    return null
  }

  public async revokeKey(id: string) {
    const result = await this.revokeRequest.fetch({ id })
    if (result.isRight) {
      return result.data.revokeApiKey
    }
    return null
  }

  public async rotateKey(id: string) {
    const result = await this.rotateRequest.fetch({ id })
    if (result.isRight) {
      return result.data.rotateApiKey
    }
    return null
  }

  public dispose(): void {
    this.myKeysRequest.abort()
    this.serviceKeysRequest.abort()
    this.createPersonalRequest.abort()
    this.createServiceRequest.abort()
    this.revokeRequest.abort()
    this.rotateRequest.abort()
  }
}

container.register(ApiKeyManagerDataSource, () => new ApiKeyManagerDataSource(), { scope: 'request' })
