import { Box, Flex, Icon, Menu, Portal } from '@chakra-ui/react'
import { FC, Fragment, useState } from 'react'
import { LuChevronRight } from 'react-icons/lu'
import { PiDotsThreeVerticalBold } from 'react-icons/pi'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

interface MenuRowProps {
  node: BaseValueNode
}

export const MenuRow: FC<MenuRowProps> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false)

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
            {node.menu.map((item) =>
              item.children ? (
                <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
                  {item.beforeSeparator && <Menu.Separator />}
                  <Menu.TriggerItem width="100%" justifyContent="space-between">
                    {item.label} <LuChevronRight />
                  </Menu.TriggerItem>
                  {item.afterSeparator && <Menu.Separator />}
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {item.children.map((childItem) => (
                          <Fragment key={childItem.value}>
                            {childItem.beforeSeparator && <Menu.Separator />}
                            <Menu.Item value={childItem.value} onClick={childItem.handler}>
                              <Box flex={1}>{childItem.label}</Box>
                            </Menu.Item>
                            {childItem.afterSeparator && <Menu.Separator />}
                          </Fragment>
                        ))}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              ) : (
                <Fragment key={item.value}>
                  {item.beforeSeparator && <Menu.Separator />}
                  <Menu.Item value={item.value} onClick={item.handler}>
                    <Box flex={1}>{item.label}</Box>
                  </Menu.Item>
                  {item.afterSeparator && <Menu.Separator />}
                </Fragment>
              ),
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
