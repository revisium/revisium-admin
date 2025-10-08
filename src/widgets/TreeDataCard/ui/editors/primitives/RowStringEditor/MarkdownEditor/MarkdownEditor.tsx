import { Box } from '@chakra-ui/react'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import * as themes from '@uiw/codemirror-themes-all'

import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'

export interface MarkdownEditorProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const MarkdownEditor: FC<MarkdownEditorProps> = observer(({ store, readonly, dataTestId }) => {
  return (
    <Box width="100%" ml="2px" pl="4px" pr="4px" minHeight="24px" minWidth="15px" data-testid={dataTestId}>
      <CodeMirror
        value={store.getPlainValue()}
        extensions={[markdown({ base: markdownLanguage }), EditorView.lineWrapping]}
        editable={!readonly}
        theme={themes.githubLight}
        maxWidth="100%"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
        }}
        onChange={(value) => {
          store.setValue(value)
        }}
      />
    </Box>
  )
})
