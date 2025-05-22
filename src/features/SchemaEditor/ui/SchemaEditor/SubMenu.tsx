import { Box, Text, useDisclosure } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import React from 'react'

interface SubMenuProps {
  label: string
  options: { id: string; label: string }[]
  onSelect: (id: string) => void
  onRequestClose?: () => void
  dataTestIdPrefix?: string
}

export const SubMenu: React.FC<SubMenuProps> = ({ label, options, onSelect, onRequestClose, dataTestIdPrefix }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSelect = (id: string) => {
    onSelect(id)
    if (onRequestClose) onRequestClose()
  }

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose} position="relative">
      <Box
        px="16px"
        py="8px"
        fontWeight="600"
        fontSize="14px"
        display="flex"
        color="rgb(26, 32, 44)"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        _hover={{ bg: 'gray.100' }}
      >
        <Text>{label}</Text>
        <ChevronRightIcon />
      </Box>

      {isOpen && (
        <Box
          position="absolute"
          top="0"
          left="100%"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          zIndex="overlay"
          minW="180px"
        >
          {options.map((opt) => (
            <Box
              key={opt.id}
              px="12px"
              py="8px"
              _hover={{ bg: 'gray.100' }}
              cursor="pointer"
              data-testid={`${dataTestIdPrefix}-submenu-${opt.id}`}
              onClick={() => handleSelect(opt.id)}
            >
              {opt.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
