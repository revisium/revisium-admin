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
  const cells = columnsModel.getVisibleCells(cellsMap)
  const lastCellIndex = cells.length - 1

  return (
    <>
      {cells.map((cell, index) => (
        <Cell store={cell} key={cell.nodeId} isLastCell={index === lastCellIndex} />
      ))}
    </>
  )
})
