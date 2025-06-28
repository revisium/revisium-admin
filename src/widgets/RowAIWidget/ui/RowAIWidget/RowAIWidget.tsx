import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { useViewModel } from 'src/shared/lib'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { RowAIWidgetModel } from 'src/widgets/RowAIWidget/model/RowAIWidgetModel.ts'
import { PromptEditor } from 'src/widgets/RowAIWidget/ui/PromptEditor/PromptEditor.tsx'

interface RowAIWidgetProps {
  schema: JsonSchema
  data: JsonValue
}

export const RowAIWidget: FC<RowAIWidgetProps> = observer(({ schema, data }) => {
  const model = useViewModel(RowAIWidgetModel)

  return (
    <Flex direction="column" width="100%" gap="1rem">
      <PromptEditor model={model.prompt} />
      <JsonCard schema={schema} readonly data={data} />
    </Flex>
  )
})
