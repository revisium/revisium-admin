import { Box, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import React from 'react'

interface SubMenuProps {
  label: string
  options: { id: string; label: string; addDividerAfter?: boolean }[]
  onSelect: (id: string) => void
  onRequestClose?: () => void
  dataTestIdPrefix?: string
}

export const SubMenu: React.FC<SubMenuProps> = ({ label, options, onSelect, onRequestClose, dataTestIdPrefix }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleClick = (id: string) => {
    onSelect(id)
    onRequestClose?.()
    onClose()
  }

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Menu
        isOpen={isOpen}
        placement="right-start"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [-8, -8],
            },
          },
        ]}
      >
        <MenuButton
          as={Box}
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
            <ChevronRightIcon />
          </Flex>
        </MenuButton>

        <MenuList>
          {options.map((option) => (
            <React.Fragment key={option.id}>
              <MenuItem data-testid={`${dataTestIdPrefix}-submenu-${option.id}`} onClick={() => handleClick(option.id)}>
                {option.label}
              </MenuItem>
              {option.addDividerAfter && <MenuDivider />}
            </React.Fragment>
          ))}
        </MenuList>
      </Menu>
    </Box>
  )
}
