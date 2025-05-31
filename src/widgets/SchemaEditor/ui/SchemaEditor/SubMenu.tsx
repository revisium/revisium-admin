import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { Menu } from '@chakra-ui/react/menu'
import { PiCaretRightThin } from 'react-icons/pi'
import React from 'react'

interface SubMenuProps {
  label: string
  options: { id: string; label: string; addDividerAfter?: boolean }[]
  onSelect: (id: string) => void
  onRequestClose?: () => void
  dataTestIdPrefix?: string
}

export const SubMenu: React.FC<SubMenuProps> = ({ label, options, onSelect, onRequestClose, dataTestIdPrefix }) => {
  const { open, onOpen, onClose } = useDisclosure()

  const handleClick = (id: string) => {
    onSelect(id)
    onRequestClose?.()
    onClose()
  }

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Menu.Root open={open} positioning={{ placement: 'right-start', gutter: -8 }}>
        <Menu.Trigger asChild>
          <Box
            px="12px"
            py="8px"
            width="100%"
            cursor="pointer"
            fontWeight="600"
            fontSize="14px"
            color="rgb(26, 32, 44)"
            _hover={{ bg: 'gray.100' }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              {label}
              <PiCaretRightThin />
            </Flex>
          </Box>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content>
            {options.map((option) => (
              <React.Fragment key={option.id}>
                <Menu.Item
                  value={option.id}
                  data-testid={`${dataTestIdPrefix}-submenu-${option.id}`}
                  onClick={() => handleClick(option.id)}
                >
                  {option.label}
                </Menu.Item>
                {option.addDividerAfter && <Menu.Separator />}
              </React.Fragment>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  )
}
