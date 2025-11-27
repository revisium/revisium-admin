import { Box, Flex } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiCaretCircleLeftLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

interface ProjectHeaderProps {
  name: string
  organizationName: string
}

export const ProjectHeader: FC<ProjectHeaderProps> = ({ name, organizationName }) => {
  const navigate = useNavigate()

  const handleBackClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <Flex flexDirection="column" alignItems="flex-start" width="100%" minWidth="0">
      <Flex alignItems="center" gap="8px" padding="4px">
        <Box
          fontSize="20px"
          color="newGray.400"
          cursor="pointer"
          _hover={{ color: 'newGray.500' }}
          onClick={handleBackClick}
          display="flex"
          alignItems="center"
          flexShrink={0}
        >
          <PiCaretCircleLeftLight />
        </Box>
        <Box
          color="black"
          fontWeight="600"
          fontSize="18px"
          lineHeight="26px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {name}
        </Box>
      </Flex>
      <Flex
        color="newGray.400"
        fontWeight="500"
        fontSize="14px"
        lineHeight="20px"
        padding="4px"
        alignItems="center"
        gap="8px"
      >
        <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {organizationName}
        </Box>
      </Flex>
    </Flex>
  )
}
