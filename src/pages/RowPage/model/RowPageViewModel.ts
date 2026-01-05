import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { RowPageDataSource } from 'src/pages/RowPage/model/RowPageDataSource.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { isValidSchema } from 'src/shared/schema/isValidSchema.ts'

export class RowPageViewModel implements IViewModel {
  constructor(
    private readonly dataSource: RowPageDataSource,
    private readonly projectContext: ProjectContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading(): boolean {
    return this.dataSource.isLoading
  }

  public get error(): string | null {
    return this.dataSource.error
  }

  public get row() {
    return this.dataSource.row
  }

  public get table() {
    return this.dataSource.table
  }

  public get schema(): JsonObjectSchema | null {
    if (!this.table?.schema) {
      return null
    }
    return this.table.schema as JsonObjectSchema
  }

  public get foreignKeysCount(): number {
    return this.dataSource.foreignKeysCount
  }

  public get isValidSchema(): boolean {
    if (!this.schema) {
      return false
    }
    return isValidSchema(this.schema)
  }

  public get hasData(): boolean {
    return this.row !== null && this.table !== null
  }

  public init(tableId: string, rowId: string): void {
    void this.dataSource.load({ revisionId: this.projectContext.revision.id, tableId, rowId })
  }

  public dispose(): void {
    this.dataSource.dispose()
  }
}

container.register(
  RowPageViewModel,
  () => {
    const dataSource = container.get(RowPageDataSource)
    const projectContext = container.get(ProjectContext)
    return new RowPageViewModel(dataSource, projectContext)
  },
  { scope: 'request' },
)
