import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { RowDatePicker } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowDatePicker/RowDatePicker'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'

export const DatePickerRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonStringValueStore

  return (
    <Row node={node}>
      <RowDatePicker store={nodeStore} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
    </Row>
  )
}
