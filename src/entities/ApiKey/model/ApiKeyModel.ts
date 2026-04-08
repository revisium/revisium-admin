import { makeAutoObservable } from 'mobx'
import { ApiKeyFieldsFragment } from 'src/__generated__/graphql-request.ts'

export interface ResolvedProject {
  id: string
  name: string
}

export class ApiKeyModel {
  private _projectNameResolver: ((id: string) => string) | null = null

  constructor(public readonly data: ApiKeyFieldsFragment) {
    makeAutoObservable(this)
  }

  public setProjectNameResolver(resolver: (id: string) => string): void {
    this._projectNameResolver = resolver
  }

  public get id(): string {
    return this.data.id
  }

  public get name(): string {
    return this.data.name
  }

  public get prefix(): string {
    return this.data.prefix
  }

  public get type(): string {
    return this.data.type
  }

  public get isExpired(): boolean {
    if (!this.data.expiresAt) {
      return false
    }
    return new Date(this.data.expiresAt) < new Date()
  }

  public get isRevoked(): boolean {
    return this.data.revokedAt !== null
  }

  public get isActive(): boolean {
    return !this.isExpired && !this.isRevoked
  }

  public get statusLabel(): 'Active' | 'Expired' | 'Revoked' {
    if (this.isRevoked) {
      return 'Revoked'
    }
    if (this.isExpired) {
      return 'Expired'
    }
    return 'Active'
  }

  public get lastUsedAt(): string | null {
    return this.data.lastUsedAt ?? null
  }

  public get createdAt(): string {
    return this.data.createdAt
  }

  public get expiresAt(): string | null {
    return this.data.expiresAt ?? null
  }

  public get readOnly(): boolean {
    return this.data.readOnly
  }

  public get organizationId(): string | null {
    return this.data.organizationId ?? null
  }

  public get projectIds(): string[] {
    return this.data.projectIds
  }

  public get resolvedProjects(): ResolvedProject[] {
    return this.data.projectIds.map((id) => ({
      id,
      name: this._projectNameResolver?.(id) ?? id,
    }))
  }

  public get permissionLabel(): string {
    if (this.data.type === 'PERSONAL') {
      return this.data.readOnly ? 'Read only' : 'Full access'
    }

    const permissions = this.data.permissions as { rules?: { action?: string[] }[] } | null
    const actions = permissions?.rules?.[0]?.action ?? []

    if (actions.includes('delete')) {
      return 'Full access'
    }
    if (actions.includes('create') || actions.includes('update')) {
      return 'Read & Write'
    }
    return 'Read only'
  }

  public get permissionColorPalette(): string {
    switch (this.permissionLabel) {
      case 'Full access':
        return 'orange'
      case 'Read & Write':
        return 'blue'
      default:
        return 'gray'
    }
  }
}
