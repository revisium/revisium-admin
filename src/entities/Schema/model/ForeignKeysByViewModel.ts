import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import {
  ForeignKeysByDataSource,
  ForeignKeysByParams,
  ForeignKeyTableData,
} from 'src/entities/Schema/model/ForeignKeysByDataSource.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'

export class ForeignKeysByViewModel implements IViewModel {
  constructor(
    private readonly dataSource: ForeignKeysByDataSource,
    private readonly getRevisionId: () => string,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading(): boolean {
    return this.dataSource.isLoading
  }

  public get error(): string | null {
    return this.dataSource.error
  }

  public get tables(): ForeignKeyTableData[] {
    return this.dataSource.tables
  }

  public get hasTables(): boolean {
    return this.tables.length > 0
  }

  public init(tableId: string, rowId: string): void {
    const params: ForeignKeysByParams = {
      revisionId: this.getRevisionId(),
      tableId,
      rowId,
    }

    void this.dataSource.load(params)
  }

  public dispose(): void {
    this.dataSource.dispose()
  }
}

container.register(
  ForeignKeysByViewModel,
  () => {
    const dataSource = container.get(ForeignKeysByDataSource)
    const projectContext = container.get(ProjectContext)
    return new ForeignKeysByViewModel(dataSource, () => projectContext.revisionId)
  },
  { scope: 'request' },
)
