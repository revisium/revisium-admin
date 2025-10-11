import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { MarkdownEditor } from './MarkdownEditor/MarkdownEditor'
import { PlainTextEditor } from './PlainTextEditor/PlainTextEditor'

interface RowStringEditorProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowStringEditor: FC<RowStringEditorProps> = observer(({ store, readonly, dataTestId }) => {
  return (
    <Flex data-testid={`${dataTestId}-string`}>
      {store.contentMediaType === 'text/markdown' ? (
        <MarkdownEditor store={store} dataTestId={dataTestId} readonly={readonly} />
      ) : (
        <PlainTextEditor store={store} dataTestId={dataTestId} readonly={readonly} />
      )}
    </Flex>
  )
})
