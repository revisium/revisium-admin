import { Badge, Box, Button, Flex, HStack, IconButton, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { PiTrashLight } from 'react-icons/pi'
import { Tooltip } from 'src/shared/ui'
import { CustomEndpointCardViewModel } from '../../model/CustomEndpointCardViewModel.ts'
import { EndpointActions } from '../EndpointActions/EndpointActions.tsx'

interface CustomEndpointCardProps {
  model: CustomEndpointCardViewModel
  onDelete: (endpointId: string) => void
  canDelete: boolean
}

export const CustomEndpointCard: FC<CustomEndpointCardProps> = observer(({ model, onDelete, canDelete }) => {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false)

  const handleDeleteClick = useCallback(() => {
    setIsDeletePopoverOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    setIsDeletePopoverOpen(false)
    onDelete(model.id)
  }, [model.id, onDelete])

  const handleDeleteCancel = useCallback(() => {
    setIsDeletePopoverOpen(false)
  }, [])

  return (
    <Box
      className="group"
      p={3}
      borderWidth="1px"
      borderColor="newGray.200"
      borderRadius="8px"
      backgroundColor="white"
      _hover={{ borderColor: 'newGray.300' }}
      width="100%"
      height="48px"
      transition="all 0.15s"
    >
      <Flex justify="space-between" align="center" gap={3} height="100%">
        <Flex align="center" gap={2} flex={1} minWidth={0}>
          <Badge
            size="sm"
            colorPalette={model.endpointType === 'GRAPHQL' ? 'pink' : 'green'}
            variant="subtle"
            fontWeight="500"
          >
            {model.endpointTypeLabel}
          </Badge>

          <Tooltip content="This is an immutable revision. Data reflects a specific point in time.">
            <Text
              fontSize="14px"
              fontWeight="500"
              color="newGray.600"
              cursor="help"
              borderBottom="1px dashed"
              borderColor="newGray.300"
              truncate
            >
              {model.revisionLabel}
            </Text>
          </Tooltip>

          <Badge size="sm" colorPalette="gray" variant="subtle">
            readonly
          </Badge>
        </Flex>

        <HStack gap={2}>
          <HStack opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
            <EndpointActions
              copyTooltip={model.copyTooltip}
              sandboxUrl={model.sandboxUrl}
              swaggerUrl={model.swaggerUrl}
              onCopy={model.copyUrl}
            />

            {canDelete && (
              <Popover.Root
                open={isDeletePopoverOpen}
                onOpenChange={(e) => setIsDeletePopoverOpen(e.open)}
                positioning={{ placement: 'bottom-end' }}
              >
                <Popover.Anchor asChild>
                  <IconButton
                    aria-label="Delete endpoint"
                    size="xs"
                    variant="ghost"
                    color="newGray.400"
                    _hover={{ color: 'red.500', backgroundColor: 'red.50' }}
                    onClick={handleDeleteClick}
                  >
                    <PiTrashLight size={16} />
                  </IconButton>
                </Popover.Anchor>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content maxWidth="280px">
                      <Popover.Arrow>
                        <Popover.ArrowTip />
                      </Popover.Arrow>
                      <Popover.Body>
                        <Text fontSize="sm" mb={3}>
                          Are you sure? This endpoint will be deleted and API consumers will lose access.
                        </Text>
                        <HStack justify="flex-end" gap={2}>
                          <Button size="xs" variant="ghost" onClick={handleDeleteCancel}>
                            Cancel
                          </Button>
                          <Button size="xs" colorPalette="red" onClick={handleDeleteConfirm}>
                            Delete
                          </Button>
                        </HStack>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            )}
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
})
