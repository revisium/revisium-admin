import { TableListItemFragment } from 'src/__generated__/graphql-request.ts'

export class TableListItemViewModel {
  constructor(private readonly data: TableListItemFragment) {}

  public get id(): string {
    return this.data.id
  }

  public get versionId(): string {
    return this.data.versionId
  }

  public get readonly(): boolean {
    return this.data.readonly
  }

  public get count(): number {
    return this.data.count
  }
}
