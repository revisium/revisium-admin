import { IRowModelReferences } from 'src/shared/model/BackendStore'
import { RowMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/row.generated.ts'

export const transformRowFragment = (fragment: RowMstFragment): Partial<IRowModelReferences> => ({
  id: fragment.id,
  versionId: fragment.versionId,
  readonly: fragment.readonly,
  createdAt: fragment.createdAt,
  data: fragment.data,
})
