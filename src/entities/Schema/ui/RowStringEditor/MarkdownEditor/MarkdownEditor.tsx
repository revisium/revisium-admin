import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'

export interface MarkdownEditorProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const MarkdownEditor: FC<MarkdownEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const handleChange = useCallback(
    (value: string) => {
      store.setValue(value)
    },
    [store],
  )

  return (
    <Box ml="2px" pl="4px" pr="4px" minHeight="24px" minWidth="15px" cursor={readonly ? 'not-allowed' : undefined}>
      {readonly ? (
        `"${store.getPlainValue()}"`
      ) : (
        <ContentEditable
          allowNewLines
          dataTestId={dataTestId}
          prefix='"'
          postfix='"'
          initValue={store.getPlainValue()}
          onChange={handleChange}
        />
      )}
    </Box>
  )
})
