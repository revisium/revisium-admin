import { Button, Dialog, HStack, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
import { NativeSelect } from '@chakra-ui/react/native-select'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { EndpointType } from 'src/__generated__/graphql-request'
import { CreateEndpointDialogViewModel } from '../../model/CreateEndpointDialogViewModel.ts'

interface CreateEndpointDialogProps {
  model: CreateEndpointDialogViewModel
}

export const CreateEndpointDialog: FC<CreateEndpointDialogProps> = observer(({ model }) => {
  return (
    <Dialog.Root open={model.isOpen} onOpenChange={(e) => !e.open && model.close()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content minWidth="400px">
            <Dialog.Header>
              <Dialog.Title>Create Endpoint</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align="stretch" gap={4}>
                <Text fontSize="sm" color="newGray.500">
                  Create a read-only endpoint for a specific committed revision. This allows API consumers to access
                  data from a fixed point in time. For Draft/Head endpoints, use the toggle switches on the main page.
                </Text>

                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="500" color="newGray.600">
                    Type
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={model.selectedType}
                      onChange={(e) => model.selectType(e.target.value as EndpointType)}
                    >
                      <option value={EndpointType.Graphql}>GraphQL</option>
                      <option value={EndpointType.RestApi}>REST API</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </VStack>

                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="500" color="newGray.600">
                    Branch
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={model.selectedBranchId ?? ''}
                      onChange={(e) => model.selectBranch(e.target.value)}
                      placeholder="Select branch"
                    >
                      {model.branchOptions.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                          {branch.isRoot ? ' (default)' : ''}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </VStack>

                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="500" color="newGray.600">
                    Revision
                  </Text>
                  {model.isLoadingRevisions ? (
                    <HStack justify="center" py={2}>
                      <Spinner size="sm" />
                    </HStack>
                  ) : model.hasNoCustomRevisions ? (
                    <Text fontSize="sm" color="orange.500">
                      No revisions available besides Draft/Head. Make a commit to create additional versions.
                    </Text>
                  ) : (
                    <NativeSelect.Root size="sm" disabled={!model.selectedBranchId}>
                      <NativeSelect.Field
                        value={model.selectedRevisionId ?? ''}
                        onChange={(e) => model.selectRevision(e.target.value)}
                        placeholder="Select revision"
                      >
                        {model.revisionOptions.map((revision) => {
                          const hasEndpoint =
                            model.selectedType === EndpointType.Graphql ? revision.hasGraphql : revision.hasRestApi
                          return (
                            <option key={revision.id} value={revision.id} disabled={hasEndpoint}>
                              {revision.label}
                              {hasEndpoint ? ' (endpoint exists)' : ''}
                            </option>
                          )
                        })}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  )}
                </VStack>

                {model.selectedRevisionHasEndpoint && model.selectedRevisionId && (
                  <Text fontSize="sm" color="orange.500">
                    This revision already has a {model.selectedType === EndpointType.Graphql ? 'GraphQL' : 'REST API'}{' '}
                    endpoint.
                  </Text>
                )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={model.close}>
                Cancel
              </Button>
              <Button colorPalette="gray" onClick={model.create} disabled={!model.canCreate} loading={model.isCreating}>
                Create
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
})
