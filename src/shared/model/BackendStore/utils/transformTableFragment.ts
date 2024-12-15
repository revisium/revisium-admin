import { ITableModelReferences } from 'src/shared/model/BackendStore'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'

export const transformTableFragment = (fragment: TableMstFragment): Partial<ITableModelReferences> => ({
  id: fragment.id,
  versionId: fragment.versionId,
  count: fragment.count,
  readonly: fragment.readonly,
  createdAt: fragment.createdAt,
  schema: fragment.schema,
})
