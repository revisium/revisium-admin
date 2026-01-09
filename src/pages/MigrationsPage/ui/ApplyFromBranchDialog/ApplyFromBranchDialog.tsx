import { Box, Button, Flex, HStack, Icon, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
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
import { NativeSelect } from '@chakra-ui/react/native-select'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiWarningCircleLight } from 'react-icons/pi'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { ApplyFromBranchDialogViewModel } from 'src/pages/MigrationsPage/model/ApplyFromBranchDialogViewModel.ts'
import { ApplyResultSection } from 'src/pages/MigrationsPage/ui/ApplyResultSection/ApplyResultSection.tsx'
import { MigrationsPreview } from 'src/pages/MigrationsPage/ui/MigrationsPreview/MigrationsPreview.tsx'

interface ApplyFromBranchDialogProps {
  model: ApplyFromBranchDialogViewModel
}

export const ApplyFromBranchDialog: FC<ApplyFromBranchDialogProps> = observer(({ model }) => {
  return (
    <DialogRoot open={model.isOpen} onOpenChange={({ open }) => !open && model.close()} size="xl">
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent maxWidth="800px">
            <DialogHeader>
              <DialogTitle>Apply Migrations from Branch</DialogTitle>
            </DialogHeader>

            <DialogBody height="500px" overflow="auto">
              <VStack align="stretch" gap={4} height="100%">
                {model.showResult && model.applyResultSummary ? (
                  <ApplyResultSection summary={model.applyResultSummary} failedResults={model.failedResults} />
                ) : model.hasNoBranches ? (
                  <Flex direction="column" align="center" justify="center" flex={1} gap={2}>
                    <Text color="gray.500">No other branches available</Text>
                    <Text fontSize="sm" color="gray.400">
                      Create a new branch to apply migrations from it
                    </Text>
                  </Flex>
                ) : (
                  <>
                    <HStack gap={4}>
                      <Flex flexDirection="column" gap={2} flex={1}>
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Source Branch
                        </Text>
                        {model.isLoadingBranches ? (
                          <Flex align="center" gap={2} height="40px">
                            <Spinner size="sm" />
                            <Text fontSize="sm" color="gray.400">
                              Loading branches...
                            </Text>
                          </Flex>
                        ) : (
                          <NativeSelect.Root>
                            <NativeSelect.Field
                              value={model.selectedBranchId ?? ''}
                              onChange={(e) => model.setSelectedBranchId(e.target.value || null)}
                            >
                              <option value="">Select branch</option>
                              {model.branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                  {branch.name} {branch.isRoot ? '(root)' : ''}
                                </option>
                              ))}
                            </NativeSelect.Field>
                          </NativeSelect.Root>
                        )}
                      </Flex>

                      <Flex flexDirection="column" gap={2} flex={1}>
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Source Revision
                        </Text>
                        <NativeSelect.Root disabled={!model.selectedBranchId}>
                          <NativeSelect.Field
                            value={model.selectedRevision}
                            onChange={(e) =>
                              model.setSelectedRevision(e.target.value as typeof HEAD_TAG | typeof DRAFT_TAG)
                            }
                          >
                            <option value={DRAFT_TAG}>Draft (working)</option>
                            <option value={HEAD_TAG}>Head (committed)</option>
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                      </Flex>
                    </HStack>

                    {model.selectedBranchId && (
                      <Flex direction="column" flex={1} gap={4}>
                        <Box height="1px" bg="gray.200" />

                        {model.isLoadingMigrations ? (
                          <Flex justify="center" align="center" flex={1}>
                            <Spinner />
                            <Text ml={3} color="gray.500">
                              Loading migrations...
                            </Text>
                          </Flex>
                        ) : model.previewItems.length === 0 ? (
                          <Flex justify="center" align="center" flex={1}>
                            <Text color="gray.400">No new migrations to apply from this branch</Text>
                          </Flex>
                        ) : (
                          <>
                            {model.hasConflict && (
                              <Flex align="center" gap={2} p={3} bg="orange.50" borderRadius="md">
                                <Icon as={PiWarningCircleLight} color="orange.500" boxSize={5} />
                                <Box>
                                  <Text fontSize="sm" fontWeight="500" color="orange.700">
                                    Conflict detected
                                  </Text>
                                  <Text fontSize="xs" color="orange.600">
                                    Some migrations have conflicting timestamps.
                                  </Text>
                                </Box>
                              </Flex>
                            )}

                            <MigrationsPreview
                              diffItems={model.previewItems}
                              viewMode={model.viewMode}
                              onViewModeChange={model.setViewMode}
                              summary={model.summary}
                              canRemoveLast={model.canRemoveLast}
                              onRemoveLast={model.removeLastMigration}
                              onVirtuosoRef={model.setVirtuosoRef}
                            />
                          </>
                        )}
                      </Flex>
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
