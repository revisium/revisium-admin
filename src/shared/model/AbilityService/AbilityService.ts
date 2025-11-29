import { createMongoAbility, MongoAbility, RawRuleOf, subject } from '@casl/ability'
import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { Actions, PermissionRule, Subjects } from './types.ts'

type AppAbility = MongoAbility<[Actions, Subjects]>

export class AbilityService {
  private ability: AppAbility = createMongoAbility<[Actions, Subjects]>()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public updateAbility(permissions: PermissionRule[]): void {
    const rules = permissions.map((p) => this.permissionToRule(p))
    this.ability.update(rules)
  }

  public clearAbility(): void {
    this.ability.update([])
  }

  public can(action: Actions, sub: Subjects, conditions?: Record<string, unknown>): boolean {
    if (conditions) {
      return this.ability.can(action, subject(sub, conditions) as unknown as Subjects)
    }
    return this.ability.can(action, sub)
  }

  public cannot(action: Actions, sub: Subjects, conditions?: Record<string, unknown>): boolean {
    return !this.can(action, sub, conditions)
  }

  public get rules(): RawRuleOf<AppAbility>[] {
    return this.ability.rules
  }

  private permissionToRule(permission: PermissionRule): RawRuleOf<AppAbility> {
    const rule: RawRuleOf<AppAbility> = {
      action: permission.action as Actions,
      subject: permission.subject as Subjects,
    }

    if (permission.condition) {
      rule.conditions = permission.condition as Record<string, unknown>
    }

    return rule
  }
}

container.register(AbilityService, () => new AbilityService(), { scope: 'singleton' })
