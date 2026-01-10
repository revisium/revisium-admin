import { Box } from '@chakra-ui/react'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { githubLight } from '@uiw/codemirror-theme-github'

import { FC } from 'react'

export interface MarkdownEditorProps {
  value: string
  setValue: (value: string) => void
  readonly?: boolean
  dataTestId?: string
}

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ value, setValue, readonly, dataTestId }) => {
  return (
    <Box width="100%" ml="2px" pl="4px" pr="4px" minHeight="24px" minWidth="15px" data-testid={dataTestId}>
      <CodeMirror
        value={value}
        extensions={[markdown({ base: markdownLanguage }), EditorView.lineWrapping]}
        editable={!readonly}
        theme={githubLight}
        maxWidth="100%"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
        }}
        onChange={(value) => {
          setValue(value)
        }}
      />
    </Box>
  )
}
