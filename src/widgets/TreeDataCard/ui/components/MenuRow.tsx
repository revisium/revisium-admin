import { Box, Flex, Icon, Menu, Portal } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiDotsThreeVerticalBold, PiTrash } from 'react-icons/pi'
import { toaster } from 'src/shared/ui'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

interface MenuRowProps {
  node: BaseValueNode
}

export const MenuRow: FC<MenuRowProps> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleJson = useCallback(async () => {
    await navigator.clipboard.writeText(node.getJson())

    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [node])

  return (
    <Menu.Root onOpenChange={({ open }) => setIsOpen(open)}>
      <Menu.Trigger asChild>
        {
          <Flex
            width="24px"
            left="-24px"
            position="absolute"
            zIndex={1}
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              mt="2px"
              height="24px"
              width="12px"
              borderRadius="4px"
              bg="blackAlpha.50/30"
              backdropFilter="blur(4px)"
              boxShadow="0 0 0 1px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.08)"
              opacity={isOpen ? 1 : 0}
              transition={isOpen ? 'opacity 1s ease 0s' : undefined}
              _groupHover={{
                opacity: 1,
                transition: 'opacity 0.5s ease 0s',
              }}
              _hover={{
                boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <Icon size="md" color="gray.400">
                <PiDotsThreeVerticalBold />
              </Icon>
            </Flex>
          </Flex>
        }
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {node.isExpandable && (
              <>
                <Menu.Item value="expand-all" onClick={() => node.expandAll()}>
                  <Box flex={1}>Expand all</Box>
                </Menu.Item>
                <Menu.Item value="collapse-all" onClick={() => node.collapseAll()}>
                  <Box flex={1}>Collapse all</Box>
                </Menu.Item>
                <Menu.Separator />
              </>
            )}
            <Menu.Item value="json" onClick={handleJson}>
              <Box flex={1}>Copy json</Box>
            </Menu.Item>
            {node.onDelete && (
              <>
                <Menu.Separator />
                <Menu.Item value="delete" onClick={node.onDelete}>
                  <PiTrash />
                  <Box flex={1}>Delete</Box>
                </Menu.Item>
              </>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
