import { IRowModel } from 'src/shared/model/BackendStore'
import { useCurrentDraftRow } from 'src/shared/model/ProjectPageModel/hooks/row/useCurrentDraftRow.ts'
import { useCurrentHeadRow } from 'src/shared/model/ProjectPageModel/hooks/row/useCurrentHeadRow.ts'
import { useCurrentSpecificRow } from 'src/shared/model/ProjectPageModel/hooks/row/useCurrentSpecificRow.ts'

export const useCurrentRow = (): IRowModel | null => {
  const draftRow = useCurrentDraftRow()
  const headRow = useCurrentHeadRow()
  const specificRow = useCurrentSpecificRow()

  return draftRow || headRow || specificRow
}
