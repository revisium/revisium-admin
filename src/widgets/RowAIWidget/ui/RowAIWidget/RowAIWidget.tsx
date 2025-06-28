import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useViewModel } from 'src/shared/lib'
import { RowAIWidgetModel } from 'src/widgets/RowAIWidget/model/RowAIWidgetModel.ts'
import { PromptEditor } from 'src/widgets/RowAIWidget/ui/PromptEditor/PromptEditor.tsx'

export const RowAIWidget = observer(() => {
  const model = useViewModel(RowAIWidgetModel)

  return (
    <Flex direction="column" width="100%">
      <PromptEditor model={model.prompt} />
    </Flex>
  )
})
