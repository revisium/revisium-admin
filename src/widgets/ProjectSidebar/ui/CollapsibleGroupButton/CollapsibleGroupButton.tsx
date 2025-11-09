import { Box, Flex, VStack } from '@chakra-ui/react'
import { FC, ReactNode, useState } from 'react'
import { PiCaretDownBold, PiCaretRightBold } from 'react-icons/pi'

interface CollapsibleGroupButtonProps {
  icon?: ReactNode
  label: ReactNode
  isExpanded: boolean
  onClick: () => void
  disableLabelClick?: boolean
  children?: ReactNode
}

export const CollapsibleGroupButton: FC<CollapsibleGroupButtonProps> = ({
  icon,
  label,
  isExpanded,
  onClick,
  disableLabelClick,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <Box>
      <Flex
        onClick={disableLabelClick ? undefined : onClick}
        cursor={disableLabelClick ? 'default' : 'pointer'}
        alignItems="center"
        _hover={{ backgroundColor: 'newGray.100', color: 'newGray.600' }}
        borderRadius="0.25rem"
        height="30px"
        paddingLeft="0.5rem"
        paddingRight="0.5rem"
        width="100%"
        color="newGray.500"
        fontWeight="500"
        fontSize="14px"
        minWidth="0"
        gap="0.5rem"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group"
      >
        {icon && (
          <Box
            fontSize="14px"
            color="newGray.400"
            flexShrink="0"
            onClick={disableLabelClick ? handleIconClick : undefined}
            cursor={disableLabelClick ? 'pointer' : 'inherit'}
          >
            {isHovered ? <Box as={isExpanded ? PiCaretDownBold : PiCaretRightBold} /> : icon}
          </Box>
        )}
        <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" width="100%">
          {label}
        </Box>
      </Flex>

      {isExpanded && children && (
        <VStack pl={4} mt={1} gap={1} alignItems="stretch">
          {children}
        </VStack>
      )}
    </Box>
  )
}
