import { ClientError } from 'graphql-request'
import { makeAutoObservable, runInAction } from 'mobx'
import {
  BillingStatus,
  GetLimitsPageDataQuery,
  GetLimitsPagePlansQuery,
  LimitsPagePlanFragment,
  UsageMetricFragment,
} from 'src/__generated__/graphql-request.ts'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

/* eslint-disable @typescript-eslint/no-explicit-any */
const fetchWithPartialData = <T>(fn: (...args: any[]) => Promise<T>) => {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args)
    } catch (e) {
      if (e instanceof ClientError && e.response.data) {
        return e.response.data as T
      }
      throw e
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface UsageItem {
  label: string
  tooltip: string | null
  current: string
  limit: string
  percentage: number | null
  progressColor: string
}

type PlanFeatures = {
  earlyAccessAvailable?: boolean
}

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US')
}

const formatStorage = (bytes: number): string => {
  if (bytes >= 1_073_741_824) {
    return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  }
  if (bytes >= 1_048_576) {
    return `${(bytes / 1_048_576).toFixed(1)} MB`
  }
  return `${(bytes / 1024).toFixed(1)} KB`
}

const getProgressColor = (percentage: number | null): string => {
  if (percentage === null) return 'green'
  if (percentage > 90) return 'red'
  if (percentage > 70) return 'yellow'
  return 'green'
}

const mapUsageItem = (
  label: string,
  metric: UsageMetricFragment,
  formatValue: (v: number) => string,
  tooltip: string | null = null,
): UsageItem => ({
  label,
  tooltip,
  current: formatValue(metric.current),
  limit: metric.limit !== null && metric.limit !== undefined ? formatValue(metric.limit) : 'Unlimited',
  percentage: metric.percentage ?? null,
  progressColor: getProgressColor(metric.percentage ?? null),
})

export class LimitsPageViewModel implements IViewModel {
  private readonly dataRequest = ObservableRequest.of(
    fetchWithPartialData((organizationId: string) => client.getLimitsPageData({ data: { organizationId } })),
    { skipResetting: true },
  )
  private readonly plansRequest = ObservableRequest.of(fetchWithPartialData(() => client.getLimitsPagePlans()))
  private readonly earlyAccessRequest = ObservableRequest.of(client.activateEarlyAccess)
  private readonly checkoutRequest = ObservableRequest.of(client.createCheckout)
  private readonly cancelRequest = ObservableRequest.of(client.cancelSubscription)

  public billingInterval: 'monthly' | 'yearly' = 'monthly'
  public isCancelDialogOpen = false

  constructor(private readonly context: OrganizationContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  private get data(): GetLimitsPageDataQuery | null {
    return this.dataRequest.data
  }

  private get plansData(): GetLimitsPagePlansQuery | null {
    return this.plansRequest.data
  }

  public get isLoading(): boolean {
    return this.dataRequest.isLoading && !this.dataRequest.isLoaded
  }

  public get isError(): boolean {
    return this.dataRequest.error !== null
  }

  public get billingEnabled(): boolean {
    return this.data?.configuration.billing.enabled ?? false
  }

  private get subscription() {
    return this.data?.organization.subscription ?? null
  }

  private get usage() {
    return this.data?.organization.usage ?? null
  }

  public get plans(): LimitsPagePlanFragment[] {
    return (this.plansData?.plans ?? []).filter((p) => p.isPublic)
  }

  public get currentPlanId(): string {
    return this.subscription?.planId ?? ''
  }

  public get planStatus(): BillingStatus {
    return this.subscription?.status ?? BillingStatus.Free
  }

  public get isEarlyAdopter(): boolean {
    return this.planStatus === BillingStatus.EarlyAdopter
  }

  public get isActive(): boolean {
    return this.planStatus === BillingStatus.Active
  }

  public get isFree(): boolean {
    return this.planStatus === BillingStatus.Free
  }

  public get isPastDue(): boolean {
    return this.planStatus === BillingStatus.PastDue
  }

  public get isCancelled(): boolean {
    return this.planStatus === BillingStatus.Cancelled
  }

  public get cancelAt(): string | null {
    return this.subscription?.cancelAt ?? null
  }

  public get provider(): string | null {
    return this.subscription?.provider ?? null
  }

  public get currentPeriodEnd(): string | null {
    return this.subscription?.currentPeriodEnd ?? null
  }

  public get hasPaymentManagement(): boolean {
    return this.isActive || this.isPastDue
  }

  // Usage

  public get usageItems(): UsageItem[] {
    const u = this.usage
    if (!u) return []

    return [
      mapUsageItem(
        'Row Versions',
        u.rowVersions,
        formatNumber,
        'Total row versions across all projects. Each row change in a new revision creates a version. Unchanged rows in a new revision do not count.',
      ),
      mapUsageItem('Projects', u.projects, formatNumber),
      mapUsageItem('Members', u.seats, formatNumber),
      mapUsageItem('Storage', u.storageBytes, formatStorage),
    ]
  }

  // Plan helpers

  public getPlanPrice(plan: LimitsPagePlanFragment): string {
    const price = this.billingInterval === 'yearly' ? plan.yearlyPriceUsd : plan.monthlyPriceUsd
    if (price === 0) return 'Free'
    return `$${price}/mo`
  }

  public isPlanCurrent(plan: LimitsPagePlanFragment): boolean {
    if (plan.id === this.currentPlanId) return true
    if (this.isFree && plan.monthlyPriceUsd === 0) return true
    return false
  }

  public canUpgradeTo(plan: LimitsPagePlanFragment): boolean {
    return !this.isPlanCurrent(plan) && plan.monthlyPriceUsd > 0
  }

  public canDowngradeTo(plan: LimitsPagePlanFragment): boolean {
    return !this.isPlanCurrent(plan) && plan.monthlyPriceUsd === 0 && !this.isFree
  }

  public getPlanFeatures(plan: LimitsPagePlanFragment): PlanFeatures {
    const features = plan.features
    if (typeof features === 'object' && features !== null && !Array.isArray(features)) {
      return features as PlanFeatures
    }
    return {}
  }

  public isEarlyAccessAvailable(plan: LimitsPagePlanFragment): boolean {
    return this.getPlanFeatures(plan).earlyAccessAvailable === true
  }

  // Interval

  public setBillingInterval(interval: 'monthly' | 'yearly'): void {
    this.billingInterval = interval
  }

  // Actions

  public async activateEarlyAccess(planId: string): Promise<void> {
    const result = await this.earlyAccessRequest.fetch({
      data: { organizationId: this.context.organizationId, planId },
    })
    if (result.isRight) {
      this.reload()
    }
  }

  public async createCheckout(planId: string): Promise<void> {
    const result = await this.checkoutRequest.fetch({
      data: {
        organizationId: this.context.organizationId,
        planId,
        interval: this.billingInterval,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      },
    })
    if (result.isRight) {
      window.location.href = result.data.createCheckout.checkoutUrl
    }
  }

  public openCancelDialog(): void {
    this.isCancelDialogOpen = true
  }

  public closeCancelDialog(): void {
    this.isCancelDialogOpen = false
  }

  public async cancelSubscription(): Promise<void> {
    const result = await this.cancelRequest.fetch({
      data: { organizationId: this.context.organizationId, cancelAtPeriodEnd: true },
    })
    if (result.isRight) {
      runInAction(() => {
        this.isCancelDialogOpen = false
      })
      this.reload()
    }
  }

  public get isActionLoading(): boolean {
    return this.earlyAccessRequest.isLoading || this.checkoutRequest.isLoading || this.cancelRequest.isLoading
  }

  // Lifecycle

  public init(): void {
    void this.dataRequest.fetch(this.context.organizationId)
    void this.plansRequest.fetch()
  }

  public dispose(): void {
    this.dataRequest.abort()
    this.plansRequest.abort()
  }

  private reload(): void {
    void this.dataRequest.fetch(this.context.organizationId)
    void this.plansRequest.fetch()
  }
}

container.register(
  LimitsPageViewModel,
  () => {
    const context = container.get(OrganizationContext)
    return new LimitsPageViewModel(context)
  },
  { scope: 'request' },
)
