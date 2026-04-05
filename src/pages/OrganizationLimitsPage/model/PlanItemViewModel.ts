import { makeAutoObservable } from 'mobx'
import { LimitsPagePlanFragment } from 'src/__generated__/graphql-request.ts'
import { formatLimitNumber, formatLimitStorage } from 'src/pages/OrganizationLimitsPage/lib/formatters.ts'
import { LimitsPageViewModel } from './LimitsPageViewModel.ts'

type PlanFeatures = {
  earlyAccessAvailable?: boolean
}

export class PlanItemViewModel {
  constructor(
    private readonly plan: LimitsPagePlanFragment,
    private readonly parent: LimitsPageViewModel,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return this.plan.id
  }

  public get name(): string {
    return this.plan.name
  }

  public get price(): string {
    const isYearly = this.parent.billingInterval === 'yearly'
    const price = isYearly ? this.plan.yearlyPriceUsd : this.plan.monthlyPriceUsd
    if (price === 0) return 'Free'
    return `$${price}/${isYearly ? 'yr' : 'mo'}`
  }

  public get isCurrent(): boolean {
    if (this.plan.id === this.parent.currentPlanId) return true
    if (this.parent.isFree && this.plan.monthlyPriceUsd === 0) return true
    return false
  }

  public get canUpgrade(): boolean {
    return !this.isCurrent && this.plan.monthlyPriceUsd > 0
  }

  public get canDowngrade(): boolean {
    return !this.isCurrent && this.plan.monthlyPriceUsd === 0 && !this.parent.isFree
  }

  public get earlyAccessAvailable(): boolean {
    return this.features.earlyAccessAvailable === true
  }

  public get buttonLabel(): string {
    if (this.canUpgrade) return this.earlyAccessAvailable ? 'Get Early Access' : 'Upgrade'
    if (this.canDowngrade) return 'Downgrade'
    return 'Current Plan'
  }

  public get buttonDisabled(): boolean {
    return !this.canUpgrade && !this.canDowngrade
  }

  public get projectsLimit(): string {
    return formatLimitNumber(this.plan.limits.projects)
  }

  public get membersLimit(): string {
    return formatLimitNumber(this.plan.limits.seats)
  }

  public get rowVersionsLimit(): string {
    return formatLimitNumber(this.plan.limits.rowVersions)
  }

  public get storageLimit(): string {
    return formatLimitStorage(this.plan.limits.storageBytes)
  }

  public async handleClick(): Promise<void> {
    if (this.canUpgrade) {
      if (this.earlyAccessAvailable) {
        await this.parent.activateEarlyAccess(this.plan.id)
      } else {
        await this.parent.createCheckout(this.plan.id)
      }
    } else if (this.canDowngrade) {
      await this.parent.cancelSubscription()
    }
  }

  private get features(): PlanFeatures {
    const features = this.plan.features
    if (typeof features === 'object' && features !== null && !Array.isArray(features)) {
      return features as PlanFeatures
    }
    return {}
  }
}
