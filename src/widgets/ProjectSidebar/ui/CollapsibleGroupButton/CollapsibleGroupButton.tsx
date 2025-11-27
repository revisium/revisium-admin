import { Box, Flex, VStack } from '@chakra-ui/react'
import { FC, ReactNode, useState } from 'react'
import { PiCaretDownLight } from 'react-icons/pi'

interface CollapsibleGroupButtonProps {
  label: ReactNode
  isExpanded: boolean
  onClick: () => void
  disableLabelClick?: boolean
  children?: ReactNode
}

export const CollapsibleGroupButton: FC<CollapsibleGroupButtonProps> = ({
  label,
  isExpanded,
  onClick,
  disableLabelClick,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleCaretClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <Box>
      <Flex
        className="group"
        onClick={disableLabelClick ? undefined : onClick}
        cursor={disableLabelClick ? 'default' : 'pointer'}
        alignItems="center"
        backgroundColor="transparent"
        _hover={{ backgroundColor: 'newGray.100' }}
        borderRadius="8px"
        height="36px"
        paddingX="8px"
        width="100%"
        color="newGray.400"
        fontWeight="600"
        fontSize="12px"
        textTransform="uppercase"
        minWidth="0"
        gap="12px"
        userSelect="none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box flex="1" display="flex" alignItems="center" gap="12px" minWidth="0">
          {label}
        </Box>
        {isHovered && (
          <Box
            fontSize="20px"
            color="newGray.300"
            flexShrink="0"
            onClick={handleCaretClick}
            cursor="pointer"
            display="flex"
            alignItems="center"
            transform={isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'}
            transition="transform 0.15s ease"
          >
            <PiCaretDownLight />
          </Box>
        )}
      </Flex>

      {isExpanded && children && (
        <VStack mt={1} gap={1} alignItems="stretch">
          {children}
        </VStack>
      )}
    </Box>
  )
}
