import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { CreateProjectDataSource } from './CreateProjectDataSource.ts'

export class CreateProjectViewModel implements IViewModel {
  public projectName = ''
  public branchName = ''
  public fromRevisionId = ''
  public showingSettings = false

  constructor(
    private readonly dataSource: CreateProjectDataSource,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading(): boolean {
    return this.dataSource.isLoading
  }

  public get error(): string | null {
    return this.dataSource.error
  }

  public get canCreate(): boolean {
    return this.projectName.length > 0 && !this.isLoading
  }

  private get organizationId(): string {
    const organizationId = this.authService.user?.organizationId
    if (!organizationId) {
      throw new Error('Not found organizationId')
    }
    return organizationId
  }

  public setProjectName(value: string): void {
    this.projectName = value
  }

  public setBranchName(value: string): void {
    this.branchName = value
  }

  public setFromRevisionId(value: string): void {
    this.fromRevisionId = value
  }

  public toggleSettings(): void {
    this.showingSettings = !this.showingSettings
  }

  public async create(): Promise<boolean> {
    return this.dataSource.create({
      organizationId: this.organizationId,
      projectName: this.projectName,
      branchName: this.branchName || undefined,
      fromRevisionId: this.fromRevisionId || undefined,
    })
  }

  public init(): void {}

  public dispose(): void {
    this.dataSource.dispose()
  }
}

container.register(
  CreateProjectViewModel,
  () => {
    const dataSource = container.get(CreateProjectDataSource)
    const authService = container.get(AuthService)
    return new CreateProjectViewModel(dataSource, authService)
  },
  { scope: 'request' },
)
