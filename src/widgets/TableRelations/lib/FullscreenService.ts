import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'

export class FullscreenService {
  private _isFullscreen = false
  private _containerRef: HTMLElement | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isFullscreen(): boolean {
    return this._isFullscreen
  }

  public setContainerRef(ref: HTMLElement | null): void {
    this._containerRef = ref
  }

  public toggleFullscreen(): void {
    if (this._isFullscreen) {
      void this.exitFullscreen()
    } else {
      void this.enterFullscreen()
    }
  }

  public init(): void {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange)
  }

  public dispose(): void {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    this._containerRef = null
  }

  private async enterFullscreen(): Promise<void> {
    if (!this._containerRef) {
      return
    }
    try {
      await this._containerRef.requestFullscreen()
      this._isFullscreen = true
    } catch (e) {
      console.error(e)
    }
  }

  private async exitFullscreen(): Promise<void> {
    try {
      await document.exitFullscreen()
      this._isFullscreen = false
    } catch (e) {
      console.error(e)
    }
  }

  private handleFullscreenChange = (): void => {
    this._isFullscreen = document.fullscreenElement === this._containerRef
  }
}

container.register(FullscreenService, () => new FullscreenService(), { scope: 'request' })
