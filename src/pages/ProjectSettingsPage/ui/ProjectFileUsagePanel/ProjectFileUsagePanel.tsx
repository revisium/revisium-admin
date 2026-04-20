import { Box, Button, Grid, HStack, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { observer } from 'mobx-react-lite'
import React from 'react'

interface MetricCardProps {
  label: string
  value: string
  color?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, color = 'gray.800' }) => {
  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" p={4}>
      <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="600" color={color}>
        {value}
      </Text>
    </Box>
  )
}

export interface ProjectFileUsagePanelModel {
  isLoading: boolean
  isRefreshing: boolean
  isPreviewLoading: boolean
  isApplyingRestore: boolean
  validateError: string | null
  restoreError: string | null
  currentBytesLabel: string
  expectedBytesLabel: string
  driftLabel: string
  driftColor: string
  fileBlobCount: number
  referenceCount: number
  canRestore: boolean
  restoreDialogOpen: boolean
  preview: unknown
  previewPreviousBytesLabel: string
  previewNextBytesLabel: string
  previewDriftLabel: string
  validate: () => Promise<void>
  previewRestore: () => Promise<void>
  applyRestore: () => Promise<void>
  closeRestoreDialog: () => void
}

interface ProjectFileUsagePanelProps {
  model: ProjectFileUsagePanelModel
}

export const ProjectFileUsagePanel: React.FC<ProjectFileUsagePanelProps> = observer(({ model }) => {
  return (
    <Box>
      <HStack justify="space-between" align="center" mb={3}>
        <Box>
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            File Usage
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Validate tracked file bytes and preview a restore before applying it.
          </Text>
        </Box>
        <Button variant="outline" size="sm" onClick={model.validate} loading={model.isRefreshing}>
          Refresh
        </Button>
      </HStack>

      <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="gray.50" p={4}>
        {model.isLoading ? (
          <HStack gap={3}>
            <Spinner size="sm" color="gray.400" />
            <Text fontSize="sm" color="gray.600">
              Loading file usage…
            </Text>
          </HStack>
        ) : (
          <VStack align="stretch" gap={4}>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} gap={3}>
              <MetricCard label="Current Bytes" value={model.currentBytesLabel} />
              <MetricCard label="Expected Bytes" value={model.expectedBytesLabel} />
              <MetricCard label="Drift" value={model.driftLabel} color={model.driftColor} />
              <MetricCard label="File Blobs" value={model.fileBlobCount.toLocaleString('en-US')} />
              <MetricCard label="References" value={model.referenceCount.toLocaleString('en-US')} />
            </Grid>

            {model.validateError && (
              <Text fontSize="sm" color="red.600">
                {model.validateError}
              </Text>
            )}

            {model.canRestore && (
              <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <Text fontSize="sm" color="gray.600">
                  Drift detected. Preview the restore before applying any changes.
                </Text>
                <Button size="sm" colorPalette="orange" onClick={model.previewRestore} loading={model.isPreviewLoading}>
                  Restore File Bytes
                </Button>
              </HStack>
            )}
          </VStack>
        )}
      </Box>

      <DialogRoot open={model.restoreDialogOpen} onOpenChange={({ open }) => !open && model.closeRestoreDialog()}>
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restore Project File Bytes</DialogTitle>
              </DialogHeader>

              <DialogBody>
                <VStack align="stretch" gap={4}>
                  {model.isPreviewLoading ? (
                    <HStack gap={3}>
                      <Spinner size="sm" color="gray.400" />
                      <Text fontSize="sm" color="gray.600">
                        Preparing restore preview…
                      </Text>
                    </HStack>
                  ) : (
                    <>
                      {model.preview && (
                        <Grid templateColumns="1fr" gap={3}>
                          <MetricCard label="Previous Bytes" value={model.previewPreviousBytesLabel} />
                          <MetricCard label="Next Bytes" value={model.previewNextBytesLabel} />
                          <MetricCard label="Drift" value={model.previewDriftLabel} />
                        </Grid>
                      )}

                      {model.restoreError && (
                        <Text fontSize="sm" color="red.600">
                          {model.restoreError}
                        </Text>
                      )}

                      {!model.restoreError && model.preview && (
                        <Text fontSize="sm" color="gray.600">
                          Confirm to apply the previewed restore.
                        </Text>
                      )}
                    </>
                  )}
                </VStack>
              </DialogBody>

              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  colorPalette="orange"
                  onClick={model.applyRestore}
                  disabled={!model.preview || model.isPreviewLoading || !!model.restoreError}
                  loading={model.isApplyingRestore}
                >
                  Confirm Restore
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </Box>
  )
})
