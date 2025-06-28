import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { useViewModel } from 'src/shared/lib'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { RowAIWidgetModel } from 'src/widgets/RowAIWidget/model/RowAIWidgetModel.ts'
import { PromptEditor } from 'src/widgets/RowAIWidget/ui/PromptEditor/PromptEditor.tsx'

interface RowAIWidgetProps {
  store: RowDataCardStore
}

export const RowAIWidget: FC<RowAIWidgetProps> = observer(({ store }) => {
  const model = useViewModel(RowAIWidgetModel)

  return (
    <Flex direction="column" width="100%" gap="1rem">
      <PromptEditor model={model.prompt} />
      <JsonCard schema={store.schemaStore.getPlainSchema()} readonly data={store.root.getPlainValue()} />
    </Flex>
  )
})
