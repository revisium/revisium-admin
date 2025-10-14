import { Box, Flex, Icon, Menu, Portal } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiBracketsCurlyThin, PiDotsThreeVerticalBold, PiTrash } from 'react-icons/pi'
import { toaster } from 'src/shared/ui'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

interface MenuTriggerProps {
  node: BaseValueNode
}

export const MenuTrigger: FC<MenuTriggerProps> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleJson = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(node.getStore().getPlainValue(), null, 4))

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
              transition={isOpen ? 'opacity 0.5s ease 0s' : undefined}
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
            <Menu.Item value="json" onClick={handleJson}>
              <PiBracketsCurlyThin />
              <Box flex={1}>Copy json</Box>
            </Menu.Item>
            {node.onDelete && (
              <Menu.Item value="delete" onClick={node.onDelete}>
                <PiTrash />
                <Box flex={1}>Delete</Box>
              </Menu.Item>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
