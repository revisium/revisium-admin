import { Box, HoverCard, IconButton, Tabs, VStack, HStack } from '@chakra-ui/react'
import { json } from '@codemirror/lang-json'
import { githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror, { EditorSelection, EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuBraces, LuCopy } from 'react-icons/lu'
import { FileData } from 'src/pages/AssetsPage/lib/extractFilesFromData'
import { toaster } from 'src/shared/ui'

interface JsonPreviewButtonProps {
  file: FileData
  rowData?: unknown
  fieldPath?: string
}

export const JsonPreviewButton: FC<JsonPreviewButtonProps> = ({ file, rowData }) => {
  const [activeTab, setActiveTab] = useState('file')
  const rowEditorRef = useRef<ReactCodeMirrorRef>(null)

  const fileJsonText = useMemo(() => JSON.stringify(file, null, 2), [file])
  const rowJsonText = useMemo(() => (rowData ? JSON.stringify(rowData, null, 2) : ''), [rowData])

  const currentJsonText = activeTab === 'file' ? fileJsonText : rowJsonText

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentJsonText)
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [currentJsonText])

  useEffect(() => {
    if (activeTab === 'row' && rowEditorRef.current?.view && rowJsonText && file.fileId) {
      const view = rowEditorRef.current.view
      const searchStr = `"fileId": "${file.fileId}"`
      const fileIdIndex = rowJsonText.indexOf(searchStr)
      if (fileIdIndex !== -1) {
        const from = fileIdIndex
        const to = fileIdIndex + searchStr.length
        setTimeout(() => {
          view.dispatch({
            selection: EditorSelection.create([EditorSelection.range(from, to)]),
            effects: EditorView.scrollIntoView(from, { y: 'center' }),
          })
        }, 50)
      }
    }
  }, [activeTab, rowJsonText, file.fileId])

  return (
    <HoverCard.Root size="lg" openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <IconButton variant="ghost" size="xs" color="fg.muted" aria-label="View JSON">
          <LuBraces />
        </IconButton>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content css={{ minWidth: '450px' }} p={2}>
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          <VStack align="stretch" gap={2}>
            <HStack justify="space-between" px={1}>
              <Tabs.Root
                value={activeTab}
                onValueChange={(e) => setActiveTab(e.value)}
                size="sm"
                variant="plain"
                fitted
              >
                <Tabs.List gap={2}>
                  <Tabs.Trigger
                    value="file"
                    fontSize="xs"
                    fontWeight="600"
                    color={activeTab === 'file' ? 'newGray.600' : 'newGray.400'}
                    px={0}
                    _hover={{ color: 'newGray.500' }}
                  >
                    File
                  </Tabs.Trigger>
                  {rowData !== undefined && (
                    <Tabs.Trigger
                      value="row"
                      fontSize="xs"
                      fontWeight="600"
                      color={activeTab === 'row' ? 'newGray.600' : 'newGray.400'}
                      px={0}
                      _hover={{ color: 'newGray.500' }}
                    >
                      Row
                    </Tabs.Trigger>
                  )}
                </Tabs.List>
              </Tabs.Root>
              <IconButton variant="ghost" size="xs" color="fg.muted" aria-label="Copy JSON" onClick={handleCopy}>
                <LuCopy />
              </IconButton>
            </HStack>
            <Box maxHeight="300px" overflow="auto" borderRadius="md">
              {activeTab === 'file' ? (
                <CodeMirror
                  value={fileJsonText}
                  extensions={[EditorView.lineWrapping, json()]}
                  editable={false}
                  theme={githubLight}
                  basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false,
                    highlightActiveLineGutter: false,
                  }}
                />
              ) : (
                <CodeMirror
                  ref={rowEditorRef}
                  value={rowJsonText}
                  extensions={[EditorView.lineWrapping, json()]}
                  editable={false}
                  theme={githubLight}
                  basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false,
                    highlightActiveLineGutter: false,
                  }}
                />
              )}
            </Box>
          </VStack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
