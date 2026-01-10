import { Box, Button, Dialog, Field, Input, NativeSelect, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { CreateBranchDialogViewModel } from '../../model/CreateBranchDialogViewModel.ts'
import { RevisionSelectItem } from './RevisionSelectItem.tsx'

interface CreateBranchDialogProps {
  model: CreateBranchDialogViewModel
}

export const CreateBranchDialog: FC<CreateBranchDialogProps> = observer(({ model }) => {
  const handleBranchChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      model.selectBranch(e.target.value)
    },
    [model],
  )

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      model.setBranchName(e.target.value)
    },
    [model],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && model.canCreate) {
        void model.create()
      }
    },
    [model],
  )

  return (
    <Dialog.Root open={model.isOpen} onOpenChange={(e) => !e.open && model.close()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="600px">
            <Dialog.Header>
              <Dialog.Title>Create new branch</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Field.Root>
                  <Field.Label>Source branch</Field.Label>
                  <NativeSelect.Root disabled={model.isLoadingBranches}>
                    <NativeSelect.Field value={model.selectedBranchId ?? ''} onChange={handleBranchChange}>
                      <option value="">Select a branch...</option>
                      {model.branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                          {branch.isRoot ? ' (default)' : ''}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                {model.selectedBranchId && (
                  <Field.Root>
                    <Field.Label>Source revision</Field.Label>
                    {model.isLoadingRevisions ? (
                      <Box py={4} textAlign="center">
                        <Spinner size="sm" />
                      </Box>
                    ) : model.revisions.length === 0 ? (
                      <Text fontSize="sm" color="newGray.400" py={2}>
                        No revisions available
                      </Text>
                    ) : (
                      <Box
                        borderWidth="1px"
                        borderColor="newGray.200"
                        borderRadius="8px"
                        overflow="hidden"
                        maxHeight="300px"
                        width="100%"
                      >
                        <Virtuoso
                          style={{ height: Math.min(model.revisions.length * 40, 300), width: '100%' }}
                          totalCount={model.revisions.length}
                          itemContent={(index) => {
                            const revision = model.revisions[index]
                            if (!revision) {
                              return null
                            }
                            return (
                              <RevisionSelectItem
                                revision={revision}
                                isSelected={model.selectedRevisionId === revision.id}
                                onClick={() => model.selectRevision(revision.id)}
                              />
                            )
                          }}
                        />
                      </Box>
                    )}
                  </Field.Root>
                )}

                {model.selectedRevisionId && (
                  <Field.Root>
                    <Field.Label>New branch name</Field.Label>
                    <Input
                      value={model.branchName}
                      onChange={handleNameChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter branch name..."
                      autoFocus
                    />
                  </Field.Root>
                )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="ghost" onClick={model.close} disabled={model.isCreating}>
                Cancel
              </Button>
              <Button onClick={model.create} disabled={!model.canCreate} loading={model.isCreating}>
                Create branch
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
})
