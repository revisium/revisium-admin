import { createMongoAbility, MongoAbility, RawRuleOf, subject } from '@casl/ability'
import { container } from 'src/shared/lib'
import { Actions, PermissionRule, PermissionScope, Subjects } from './types.ts'

type AppAbility = MongoAbility<[Actions, Subjects]>

const EXPANDABLE_PERMISSION_IDS = ['read-project-private', 'read-project-public']
const EXPANDED_SUBJECTS: Subjects[] = ['Table', 'Row', 'Branch', 'Revision', 'Endpoint']

export class PermissionService {
  private readonly ability: AppAbility = createMongoAbility<[Actions, Subjects]>()
  private readonly loadedScopes = new Set<string>()

  public addSystemPermissions(permissions: PermissionRule[]): void {
    const scopeKey = this.scopeToKey({ type: 'system' })
    if (this.loadedScopes.has(scopeKey)) {
      return
    }

    const rules = this.permissionsToRules(permissions, null)
    const expandedRules = this.expandPermissions(permissions, null)

    this.ability.update([...this.ability.rules, ...rules, ...expandedRules])
    this.loadedScopes.add(scopeKey)
  }

  public addOrganizationPermissions(organizationId: string, permissions: PermissionRule[]): void {
    const scopeKey = this.scopeToKey({ type: 'organization', organizationId })
    if (this.loadedScopes.has(scopeKey)) {
      return
    }

    const scopeCondition = { organizationId }
    const rules = this.permissionsToRules(permissions, scopeCondition)
    const expandedRules = this.expandPermissions(permissions, scopeCondition)

    this.ability.update([...this.ability.rules, ...rules, ...expandedRules])
    this.loadedScopes.add(scopeKey)
  }

  public addProjectPermissions(projectId: string, permissions: PermissionRule[]): void {
    const scopeKey = this.scopeToKey({ type: 'project', projectId })
    if (this.loadedScopes.has(scopeKey)) {
      return
    }

    const scopeCondition = { projectId }
    const rules = this.permissionsToRules(permissions, scopeCondition)
    const expandedRules = this.expandPermissions(permissions, scopeCondition)

    this.ability.update([...this.ability.rules, ...rules, ...expandedRules])
    this.loadedScopes.add(scopeKey)
  }

  public can(action: Actions, sub: Subjects, context?: Record<string, unknown>): boolean {
    const subjectWithContext = subject(sub, context ?? {}) as unknown as Subjects
    return this.ability.can(action, subjectWithContext)
  }

  public cannot(action: Actions, sub: Subjects, context?: Record<string, unknown>): boolean {
    return !this.can(action, sub, context)
  }

  public hasScope(scope: PermissionScope): boolean {
    return this.loadedScopes.has(this.scopeToKey(scope))
  }

  public clearAll(): void {
    this.ability.update([])
    this.loadedScopes.clear()
  }

  private scopeToKey(scope: PermissionScope): string {
    switch (scope.type) {
      case 'system':
        return 'system'
      case 'organization':
        return `organization:${scope.organizationId}`
      case 'project':
        return `project:${scope.projectId}`
    }
  }

  private permissionsToRules(
    permissions: PermissionRule[],
    scopeCondition: Record<string, unknown> | null,
  ): RawRuleOf<AppAbility>[] {
    return permissions.map((p) => this.permissionToRule(p, scopeCondition))
  }

  private permissionToRule(
    permission: PermissionRule,
    scopeCondition: Record<string, unknown> | null,
  ): RawRuleOf<AppAbility> {
    const rule: RawRuleOf<AppAbility> = {
      action: permission.action as Actions,
      subject: permission.subject as Subjects,
    }

    const conditions = this.mergeConditions(permission.condition, scopeCondition)
    if (conditions) {
      rule.conditions = conditions
    }

    return rule
  }

  private mergeConditions(
    permissionCondition: Record<string, unknown> | null | undefined,
    scopeCondition: Record<string, unknown> | null,
  ): Record<string, unknown> | undefined {
    const hasPermissionCondition = permissionCondition && Object.keys(permissionCondition).length > 0
    const hasScopeCondition = scopeCondition && Object.keys(scopeCondition).length > 0

    if (!hasPermissionCondition && !hasScopeCondition) {
      return undefined
    }

    return {
      ...(permissionCondition ?? {}),
      ...(scopeCondition ?? {}),
    }
  }

  private expandPermissions(
    permissions: PermissionRule[],
    scopeCondition: Record<string, unknown> | null,
  ): RawRuleOf<AppAbility>[] {
    const expandedRules: RawRuleOf<AppAbility>[] = []

    for (const permission of permissions) {
      if (EXPANDABLE_PERMISSION_IDS.includes(permission.id)) {
        for (const sub of EXPANDED_SUBJECTS) {
          const rule: RawRuleOf<AppAbility> = {
            action: 'read',
            subject: sub,
          }

          if (scopeCondition && Object.keys(scopeCondition).length > 0) {
            rule.conditions = { ...scopeCondition }
          }

          expandedRules.push(rule)
        }
      }
    }

    return expandedRules
  }
}

container.register(PermissionService, () => new PermissionService(), { scope: 'singleton' })
