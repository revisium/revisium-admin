import { Badge, Box, Button, Flex, HStack, IconButton, Link, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { PiCodeLight, PiCopyLight, PiFlaskLight, PiTrashLight } from 'react-icons/pi'
import { toaster, Tooltip } from 'src/shared/ui'
import { CustomEndpointCardViewModel } from '../../model/CustomEndpointCardViewModel.ts'

interface CustomEndpointCardProps {
  model: CustomEndpointCardViewModel
  onDelete: (endpointId: string) => void
  canDelete: boolean
}

export const CustomEndpointCard: FC<CustomEndpointCardProps> = observer(({ model, onDelete, canDelete }) => {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false)

  const handleCopy = useCallback(() => {
    model.copyUrl()
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [model])

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
          <HStack gap={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
            <Tooltip content={model.copyTooltip}>
              <IconButton
                aria-label="Copy URL"
                size="xs"
                variant="ghost"
                color="newGray.400"
                _hover={{ color: 'newGray.600', backgroundColor: 'newGray.100' }}
                onClick={handleCopy}
              >
                <PiCopyLight size={16} />
              </IconButton>
            </Tooltip>

            {model.sandboxUrl && (
              <Tooltip content="Open Apollo Sandbox">
                <Link href={model.sandboxUrl} target="_blank" rel="noopener noreferrer">
                  <IconButton
                    aria-label="Open Sandbox"
                    size="xs"
                    variant="ghost"
                    color="newGray.400"
                    _hover={{ color: 'newGray.600', backgroundColor: 'newGray.100' }}
                  >
                    <PiFlaskLight size={16} />
                  </IconButton>
                </Link>
              </Tooltip>
            )}

            {model.swaggerUrl && (
              <Tooltip content="Open Swagger UI">
                <Link href={model.swaggerUrl} target="_blank" rel="noopener noreferrer">
                  <IconButton
                    aria-label="Open Swagger"
                    size="xs"
                    variant="ghost"
                    color="newGray.400"
                    _hover={{ color: 'newGray.600', backgroundColor: 'newGray.100' }}
                  >
                    <PiCodeLight size={16} />
                  </IconButton>
                </Link>
              </Tooltip>
            )}

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
