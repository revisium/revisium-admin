import { makeAutoObservable } from 'mobx'
import { UsageMetricFragment } from 'src/__generated__/graphql-request.ts'
import { formatNumber, formatStorage } from 'src/pages/OrganizationLimitsPage/lib/formatters.ts'

type FormatMode = 'number' | 'storage'

const FORMAT_FN: Record<FormatMode, (v: number) => string> = {
  number: formatNumber,
  storage: formatStorage,
}

export class UsageItemViewModel {
  constructor(
    private readonly metric: UsageMetricFragment,
    private readonly _label: string,
    private readonly formatMode: FormatMode,
    private readonly _tooltip: string | null = null,
  ) {
    makeAutoObservable(this)
  }

  public get label(): string {
    return this._label
  }

  public get tooltip(): string | null {
    return this._tooltip
  }

  public get current(): string {
    return FORMAT_FN[this.formatMode](this.metric.current)
  }

  public get limit(): string {
    if (this.metric.limit === null || this.metric.limit === undefined) return 'Unlimited'
    return FORMAT_FN[this.formatMode](this.metric.limit)
  }

  public get isUnlimited(): boolean {
    return this.metric.limit === null || this.metric.limit === undefined
  }

  public get percentage(): number | null {
    return this.metric.percentage ?? null
  }

  public get progressColor(): string {
    if (this.percentage === null) return 'green'
    if (this.percentage > 90) return 'red'
    if (this.percentage > 70) return 'yellow'
    return 'green'
  }
}
