import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'
import { PromptEditorModel } from 'src/widgets/RowAIWidget/model/PromptEditorModel.ts'

interface PromptEditorProps {
  model: PromptEditorModel
}

export const PromptEditor: FC<PromptEditorProps> = observer(({ model }) => {
  const handleChange = useCallback(
    (value: string) => {
      model.setValue(value)
    },
    [model],
  )

  return (
    <Box ml="2px" pl="4px" pr="4px" minHeight="24px" minWidth="15px" width="100%">
      <ContentEditable
        autoFocus
        placeholder="Enter your request (e.g. generate suggestions or fix data)"
        initValue={model.value}
        onChange={handleChange}
      />
    </Box>
  )
})
