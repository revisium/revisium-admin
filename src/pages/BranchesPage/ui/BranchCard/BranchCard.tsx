import { Badge, Box, Button, Flex, HStack, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiStarLight, PiTrashLight } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { BranchItemViewModel } from 'src/pages/BranchesPage/model/BranchItemViewModel.ts'

interface BranchCardProps {
  model: BranchItemViewModel
}

export const BranchCard: FC<BranchCardProps> = observer(({ model }) => {
  return (
    <Box
      className="group"
      p={4}
      borderWidth="1px"
      borderColor="newGray.200"
      borderRadius="8px"
      backgroundColor="white"
      _hover={{ borderColor: 'newGray.300' }}
      transition="all 0.15s"
    >
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Flex direction="column" gap={2} flex={1} minWidth={0}>
          <HStack gap={2}>
            <Link to={model.link}>
              <Text
                fontSize="14px"
                fontWeight="500"
                color="newGray.600"
                _hover={{ color: 'newGray.800', textDecoration: 'underline' }}
              >
                {model.name}
              </Text>
            </Link>
            {model.isRoot && (
              <HStack gap={1} color="newGray.400">
                <PiStarLight size={14} />
                <Text fontSize="12px">default</Text>
              </HStack>
            )}
            {model.touched && (
              <Badge size="sm" colorPalette="yellow" variant="subtle">
                uncommitted
              </Badge>
            )}
          </HStack>

          <HStack gap={3} fontSize="12px" color="newGray.400">
            {model.parentBranchName && model.parentRevisionLink && (
              <Text>
                from{' '}
                <Link to={model.parentRevisionLink}>
                  <Text as="span" fontWeight="500" _hover={{ color: 'newGray.600', textDecoration: 'underline' }}>
                    {model.parentBranchName}/{model.parentRevisionLabel}
                  </Text>
                </Link>
              </Text>
            )}
            <Text>{model.createdAt.toLocaleDateString()}</Text>
          </HStack>
        </Flex>

        {model.canDelete && (
          <Popover.Root
            open={model.isDeletePopoverOpen}
            onOpenChange={(e) => model.setDeletePopoverOpen(e.open)}
            positioning={{ placement: 'bottom-end' }}
          >
            <Popover.Anchor>
              <Button
                size="xs"
                variant="ghost"
                color="newGray.400"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.15s"
                onClick={() => model.setDeletePopoverOpen(true)}
              >
                <PiTrashLight />
              </Button>
            </Popover.Anchor>
            <Portal>
              <Popover.Positioner>
                <Popover.Content maxWidth="280px">
                  <Popover.Arrow>
                    <Popover.ArrowTip />
                  </Popover.Arrow>
                  <Popover.Body>
                    <Text fontSize="sm" mb={3}>
                      Are you sure you want to delete branch &quot;{model.name}&quot;? This will also disable all
                      endpoints associated with this branch.
                    </Text>
                    <HStack justify="flex-end" gap={2}>
                      <Button size="xs" variant="ghost" onClick={() => model.setDeletePopoverOpen(false)}>
                        Cancel
                      </Button>
                      <Button size="xs" colorPalette="red" onClick={model.delete}>
                        Delete
                      </Button>
                    </HStack>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        )}
      </Flex>
    </Box>
  )
})
