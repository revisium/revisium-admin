import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { useRowAIWidgetModel } from 'src/widgets/RowAIWidget/hooks/useRowAIWidgetModel.ts'
import { PromptEditor } from 'src/widgets/RowAIWidget/ui/PromptEditor/PromptEditor.tsx'

interface RowAIWidgetProps {
  schema: JsonSchema
  data: JsonValue
  rowId: string
  onChange: (data: JsonValue) => void
}

export const RowAIWidget: FC<RowAIWidgetProps> = observer(({ schema, data, rowId, onChange }) => {
  const model = useRowAIWidgetModel(data, rowId, onChange)

  const handleEnter = useCallback(async () => {
    await model.submit()
  }, [model])

  return (
    <Flex direction="column" width="100%" gap="1rem">
      <PromptEditor model={model.prompt} onEnter={handleEnter} />
      <JsonCard schema={schema} readonly data={model.data} />
    </Flex>
  )
})
