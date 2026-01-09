import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'

type RefreshCallback = () => void

export class TableListRefreshService {
  private readonly callbacks: Set<RefreshCallback> = new Set()

  constructor() {
    makeAutoObservable(this)
  }

  public subscribe(callback: RefreshCallback): () => void {
    this.callbacks.add(callback)
    return () => {
      this.callbacks.delete(callback)
    }
  }

  public refresh(): void {
    this.callbacks.forEach((callback) => callback())
  }
}

container.register(TableListRefreshService, () => new TableListRefreshService(), { scope: 'singleton' })
