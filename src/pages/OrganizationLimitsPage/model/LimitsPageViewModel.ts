import { makeAutoObservable, runInAction } from 'mobx'
import { BillingStatus, GetLimitsPageDataQuery, GetLimitsPagePlansQuery } from 'src/__generated__/graphql-request.ts'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'
import { PlanItemViewModel } from './PlanItemViewModel.ts'
import { UsageItemViewModel } from './UsageItemViewModel.ts'

const ROW_VERSIONS_TOOLTIP =
  'Total row versions across all projects. Each row change in a new revision creates a version. Unchanged rows in a new revision do not count.'

export class LimitsPageViewModel implements IViewModel {
  private readonly dataRequest = ObservableRequest.of(
    (organizationId: string) => client.getLimitsPageData({ data: { organizationId } }),
    { skipResetting: true },
  )
  private readonly plansRequest = ObservableRequest.of(() => client.getLimitsPagePlans())
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
    return this.dataRequest.error !== null && this.dataRequest.data === null
  }

  public get billingEnabled(): boolean {
    return this.data?.configuration.billing.enabled ?? false
  }

  public get pageTitle(): string {
    return this.billingEnabled ? 'Billing' : 'Usage'
  }

  public get pageSubtitle(): string {
    return this.billingEnabled ? 'Plan, usage, and payment management.' : 'Resource usage overview.'
  }

  private get subscription() {
    return this.data?.organization.subscription ?? null
  }

  private get usage() {
    return this.data?.organization.usage ?? null
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

  public get statusTitle(): string {
    if (this.isFree) return 'Free Plan'
    if (this.isEarlyAdopter) return 'Pro Plan — Early Access'
    if (this.isActive) return 'Pro Plan'
    if (this.isPastDue) return 'Payment failed'
    if (this.isCancelled) return 'Plan cancelled'
    return ''
  }

  public get statusSubtitle(): string | null {
    if (this.isEarlyAdopter) return 'Free while in Early Access'
    if (this.isActive && this.currentPeriodEnd) {
      return `Renews ${new Date(this.currentPeriodEnd).toLocaleDateString()}`
    }
    if (this.isPastDue) return 'Please update your payment method'
    if (this.isCancelled && this.cancelAt) {
      return `Downgrades on ${new Date(this.cancelAt).toLocaleDateString()}`
    }
    return null
  }

  public get statusColor(): string {
    if (this.isEarlyAdopter) return 'purple'
    if (this.isActive) return 'green'
    if (this.isPastDue) return 'orange'
    if (this.isCancelled) return 'red'
    return 'gray'
  }

  public get usageItems(): UsageItemViewModel[] {
    const u = this.usage
    if (!u) return []

    return [
      new UsageItemViewModel(u.rowVersions, 'Row Versions', 'number', ROW_VERSIONS_TOOLTIP),
      new UsageItemViewModel(u.projects, 'Projects', 'number'),
      new UsageItemViewModel(u.seats, 'Members', 'number'),
      new UsageItemViewModel(u.storageBytes, 'Storage', 'storage'),
    ]
  }

  public get planItems(): PlanItemViewModel[] {
    return (this.plansData?.plans ?? []).filter((p) => p.isPublic).map((p) => new PlanItemViewModel(p, this))
  }

  public setBillingInterval(interval: 'monthly' | 'yearly'): void {
    this.billingInterval = interval
  }

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
        successUrl: globalThis.location.href,
        cancelUrl: globalThis.location.href,
      },
    })
    if (result.isRight) {
      globalThis.location.href = result.data.createCheckout.checkoutUrl
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
