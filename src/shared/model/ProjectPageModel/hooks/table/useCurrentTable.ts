import { useCurrentDraftTable } from 'src/shared/model/ProjectPageModel/hooks/table/useCurrentDraftTable.ts'
import { useCurrentHeadTable } from 'src/shared/model/ProjectPageModel/hooks/table/useCurrentHeadTable.ts'
import { useCurrentSpecificTable } from 'src/shared/model/ProjectPageModel/hooks/table/useCurrentSpecificTable.ts'
import { ITableModel } from 'src/shared/model/BackendStore'

export const useCurrentTable = (): ITableModel | null => {
  const draftTable = useCurrentDraftTable()
  const headTable = useCurrentHeadTable()
  const specificTable = useCurrentSpecificTable()

  return draftTable || headTable || specificTable
}
