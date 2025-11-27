import { Button, Flex, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
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
import { EndpointType } from 'src/__generated__/graphql-request'
import { CreateEndpointModalViewModel } from 'src/pages/EndpointsPage/model/CreateEndpointModalViewModel.ts'

interface CreateEndpointModalProps {
  model: CreateEndpointModalViewModel
}

export const CreateEndpointModal: FC<CreateEndpointModalProps> = observer(({ model }) => {
  return (
    <DialogRoot open={model.isOpen} onOpenChange={({ open }) => !open && model.close()}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Endpoint</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <VStack align="stretch" gap="1rem">
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    Branch
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={model.branchId ?? ''}
                      onChange={(e) => model.setBranchId(e.target.value || null)}
                    >
                      <option value="">Select branch</option>
                      {model.allBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>

                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    Revision
                  </Text>
                  {model.isLoadingRevisions ? (
                    <Flex align="center" gap={2}>
                      <Spinner size="sm" />
                      <Text fontSize="sm" color="gray.400">
                        Loading revisions...
                      </Text>
                    </Flex>
                  ) : (
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={model.revisionId ?? ''}
                        onChange={(e) => model.setRevisionId(e.target.value || null)}
                        _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                        {...(!model.branchId && { pointerEvents: 'none', opacity: 0.4 })}
                      >
                        <option value="">Select revision</option>
                        {model.availableRevisions.map((revision) => (
                          <option key={revision.id} value={revision.id}>
                            {revision.label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  )}
                </Flex>

                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    Endpoint Type
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={model.endpointType}
                      onChange={(e) => model.setEndpointType(e.target.value as EndpointType)}
                    >
                      <option value={EndpointType.Graphql}>GraphQL</option>
                      <option value={EndpointType.RestApi}>REST API</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>
              </VStack>
            </DialogBody>

            <DialogFooter>
              <Button variant="outline" onClick={model.close}>
                Cancel
              </Button>
              <Button onClick={model.create} disabled={!model.canCreate} loading={model.isCreating}>
                Create
              </Button>
            </DialogFooter>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
