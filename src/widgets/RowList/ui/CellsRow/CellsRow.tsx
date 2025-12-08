import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { Cell } from 'src/widgets/RowList/ui/Cell/Cell'

interface CellsRowProps {
  columnsModel: ColumnsModel
  cellsMap: Map<string, JsonValueStore>
}

export const CellsRow: FC<CellsRowProps> = observer(({ columnsModel, cellsMap }) => {
  const columns = columnsModel.columns
  const lastCellIndex = columns.length - 1

  return (
    <>
      {columns.map((column, index) => {
        const cell = cellsMap.get(column.id)
        if (!cell) return null
        return <Cell store={cell} key={column.id} isLastCell={index === lastCellIndex} />
      })}
    </>
  )
})
