import { Box, Button, Flex, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { json } from '@codemirror/lang-json'
import { githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiWarningCircleLight } from 'react-icons/pi'
import { ApplyMigrationsDialogViewModel } from 'src/pages/MigrationsPage/model/ApplyMigrationsDialogViewModel.ts'
import { ApplyResultSection } from 'src/pages/MigrationsPage/ui/ApplyResultSection/ApplyResultSection.tsx'
import { MigrationsPreview } from 'src/pages/MigrationsPage/ui/MigrationsPreview/MigrationsPreview.tsx'

interface ApplyMigrationsDialogProps {
  model: ApplyMigrationsDialogViewModel
}

export const ApplyMigrationsDialog: FC<ApplyMigrationsDialogProps> = observer(({ model }) => {
  return (
    <DialogRoot open={model.isOpen} onOpenChange={({ open }) => !open && model.close()} size="xl">
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent maxWidth="800px">
            <DialogHeader>
              <DialogTitle>Apply Migrations from JSON</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <VStack align="stretch" gap={4}>
                {model.showResult && model.applyResultSummary ? (
                  <ApplyResultSection summary={model.applyResultSummary} failedResults={model.failedResults} />
                ) : (
                  <>
                    <Box>
                      <Text fontSize="sm" fontWeight="500" color="gray.600" mb={2}>
                        Paste migrations JSON
                      </Text>
                      <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
                        <CodeMirror
                          value={model.jsonInput}
                          onChange={model.setJsonInput}
                          extensions={[EditorView.lineWrapping, json()]}
                          theme={githubLight}
                          placeholder='[{ "changeType": "init", "tableId": "posts", ... }]'
                          minHeight="150px"
                          maxHeight="200px"
                          basicSetup={{
                            lineNumbers: true,
                            foldGutter: true,
                          }}
                        />
                      </Box>
                      {model.parseError && (
                        <Text fontSize="sm" color="red.500" mt={1}>
                          {model.parseError}
                        </Text>
                      )}
                    </Box>

                    {model.previewItems.length > 0 && (
                      <>
                        <Box height="1px" bg="gray.200" />

                        {model.hasConflict && (
                          <Flex align="center" gap={2} p={3} bg="orange.50" borderRadius="md">
                            <Icon as={PiWarningCircleLight} color="orange.500" boxSize={5} />
                            <Box>
                              <Text fontSize="sm" fontWeight="500" color="orange.700">
                                Conflict detected
                              </Text>
                              <Text fontSize="xs" color="orange.600">
                                Remove conflicting migrations from the end to proceed.
                              </Text>
                            </Box>
                          </Flex>
                        )}

                        <MigrationsPreview
                          diffItems={model.previewItems}
                          viewMode={model.viewMode}
                          onViewModeChange={model.setViewMode}
                          onRemoveLast={model.removeLastMigration}
                          canRemoveLast={model.canRemoveLast}
                          onVirtuosoRef={model.setVirtuosoRef}
                          summary={model.summary}
                        />
                      </>
                    )}
                  </>
                )}
              </VStack>
            </DialogBody>

            <DialogFooter>
              <Button variant="outline" onClick={model.close}>
                {model.showResult ? 'Close' : 'Cancel'}
              </Button>
              {!model.showResult && (
                <Button onClick={model.apply} disabled={!model.canApply} loading={model.isApplying}>
                  Apply {model.migrationsToApply.length > 0 && `(${model.migrationsToApply.length})`}
                </Button>
              )}
            </DialogFooter>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
