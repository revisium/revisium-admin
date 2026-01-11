import { action, makeObservable, observable } from 'mobx'

export class FullscreenService {
  private _isFullscreen = false
  private _isInitialized = false
  private _containerRef: HTMLElement | null = null

  constructor() {
    makeObservable<FullscreenService, '_isFullscreen' | '_containerRef' | 'handleFullscreenChange'>(this, {
      _isFullscreen: observable,
      _containerRef: observable,
      setContainerRef: action.bound,
      toggleFullscreen: action.bound,
      init: action.bound,
      dispose: action.bound,
      handleFullscreenChange: action.bound,
    })
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
    if (this._isInitialized) {
      return
    }
    this._isInitialized = true
    document.addEventListener('fullscreenchange', this.handleFullscreenChange)
  }

  public dispose(): void {
    if (!this._isInitialized) {
      return
    }
    this._isInitialized = false
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    this._containerRef = null
    this._isFullscreen = false
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

  private handleFullscreenChange(): void {
    this._isFullscreen = document.fullscreenElement === this._containerRef
  }
}
