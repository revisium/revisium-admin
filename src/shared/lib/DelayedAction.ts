export class DelayedAction {
  private _timer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly delayMs: number) {}

  public schedule(action: () => void): void {
    this.cancel()
    this._timer = setTimeout(action, this.delayMs)
  }

  public cancel(): void {
    if (this._timer) {
      clearTimeout(this._timer)
      this._timer = null
    }
  }

  public dispose(): void {
    this.cancel()
  }
}
