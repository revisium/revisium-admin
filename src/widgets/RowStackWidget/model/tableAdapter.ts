import { ForeignKeyTableItemFragment } from 'src/__generated__/graphql-request.ts'
import { MinimalTableData } from 'src/widgets/RowStackWidget/model/types.ts'

export function createTableAdapter(tableFragment: ForeignKeyTableItemFragment): MinimalTableData {
  return {
    id: tableFragment.id,
    schema: tableFragment.schema,
    readonly: tableFragment.readonly,
  }
}
