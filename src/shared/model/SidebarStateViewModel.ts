import { makeAutoObservable, reaction } from 'mobx'
import { container, DelayedAction } from 'src/shared/lib'

const STORAGE_KEY = 'revisium:sidebar-collapsed'
const HOVER_DELAY_MS = 200

export class SidebarStateViewModel {
  private _isCollapsed = false
  private _isHoverExpanded = false

  private readonly _hoverDelay = new DelayedAction(HOVER_DELAY_MS)
  private readonly _leaveDelay = new DelayedAction(HOVER_DELAY_MS)

  private _keyboardHandler: ((e: KeyboardEvent) => void) | null = null

  constructor(private readonly storage: Storage) {
    this._isCollapsed = storage.getItem(STORAGE_KEY) === 'true'
    makeAutoObservable(this, {}, { autoBind: true })
    reaction(
      () => this._isCollapsed,
      (value) => {
        this.storage.setItem(STORAGE_KEY, String(value))
      },
    )
  }

  public get isCollapsed(): boolean {
    return this._isCollapsed
  }

  public get isHoverExpanded(): boolean {
    return this._isHoverExpanded
  }

  public get isSidebarVisible(): boolean {
    return !this._isCollapsed || this._isHoverExpanded
  }

  public toggle(): void {
    this._isCollapsed = !this._isCollapsed
    this._isHoverExpanded = false
  }

  public setHoverExpanded(value: boolean): void {
    this._isHoverExpanded = value
  }

  public startHoverIntent(): void {
    this._leaveDelay.cancel()
    this._hoverDelay.schedule(() => {
      this.setHoverExpanded(true)
    })
  }

  public cancelHoverIntent(): void {
    this._hoverDelay.cancel()
  }

  public startLeaveIntent(): void {
    this._leaveDelay.schedule(() => {
      this.setHoverExpanded(false)
    })
  }

  public cancelLeaveIntent(): void {
    this._leaveDelay.cancel()
  }

  public dismissOverlay(): void {
    this.setHoverExpanded(false)
  }

  public initKeyboard(): void {
    this._keyboardHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        this.toggle()
      }
    }
    window.addEventListener('keydown', this._keyboardHandler)
  }

  public disposeKeyboard(): void {
    if (this._keyboardHandler) {
      window.removeEventListener('keydown', this._keyboardHandler)
      this._keyboardHandler = null
    }
    this._hoverDelay.dispose()
    this._leaveDelay.dispose()
  }
}

container.register(SidebarStateViewModel, () => new SidebarStateViewModel(localStorage), {
  scope: 'singleton',
})
