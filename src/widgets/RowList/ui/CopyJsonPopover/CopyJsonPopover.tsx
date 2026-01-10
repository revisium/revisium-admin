import { Box, IconButton, Popover, Portal } from '@chakra-ui/react'
import { githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { LuCode2 } from 'react-icons/lu'
import { toaster, Tooltip } from 'src/shared/ui'
import { CopyButton } from 'src/shared/ui/CopyButton/CopyButton.tsx'

interface CopyJsonPopoverProps {
  data: object
  tooltipContent?: string
  testId?: string
}

export const CopyJsonPopover: FC<CopyJsonPopoverProps> = observer(({ data, tooltipContent = 'Copy JSON', testId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const text = JSON.stringify(data, null, 2)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [text])

  return (
    <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} lazyMount unmountOnExit modal={false}>
      <Tooltip content={tooltipContent} positioning={{ placement: 'top' }} disabled={isOpen}>
        <Popover.Trigger asChild>
          <IconButton
            aria-label={tooltipContent}
            size="xs"
            variant="ghost"
            colorPalette="gray"
            color="gray.400"
            data-testid={testId}
          >
            <LuCode2 size={14} />
          </IconButton>
        </Popover.Trigger>
      </Tooltip>
      <Portal>
        <Popover.Positioner>
          <Popover.Content minW="350px" maxW="500px" p={0} borderRadius="md" boxShadow="lg">
            <Box position="relative" borderWidth={1} borderColor="newGray.100" borderRadius="md" bg="white">
              <Box p={2}>
                <CodeMirror
                  value={text}
                  extensions={[EditorView.lineWrapping, json()]}
                  editable={false}
                  theme={githubLight}
                  maxWidth="100%"
                  maxHeight="300px"
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                  }}
                />
              </Box>
              <CopyButton
                dataTestId={testId ? `${testId}-copy` : undefined}
                aria-label="Copy"
                position="absolute"
                top="8px"
                right="8px"
                size="xs"
                onClick={handleCopy}
              />
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
