import { SearchResultFragment } from 'src/__generated__/graphql-request.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'

export class SearchItemModel {
  constructor(
    private readonly data: SearchResultFragment,
    private readonly linkMaker: LinkMaker,
  ) {}

  public get tableId() {
    return this.data.table.id
  }

  public get rowId() {
    return this.data.row.id
  }

  public get path() {
    return this.firstMatch?.path ?? ''
  }

  public get highlight() {
    return this.firstMatch?.highlight ?? ''
  }

  public get link() {
    return this.linkMaker.make({
      ...this.linkMaker.getCurrentOptions(),
      tableId: this.data.table.id,
      rowId: this.data.row.id,
    })
  }

  private get firstMatch() {
    return this.data.matches[0]
  }
}
