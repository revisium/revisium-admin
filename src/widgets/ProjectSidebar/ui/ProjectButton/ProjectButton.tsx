import { Box, Flex, Menu, Portal } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { PiCaretDownBold, PiHouseLight, PiLockSimple } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

interface ProjectButtonProps {
  name: string
  isPublic: boolean
}

export const ProjectButton: FC<ProjectButtonProps> = ({ name, isPublic }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleSelect = (details: { value: string }) => {
    switch (details.value) {
      case 'back':
        navigate('/')
        break
    }
  }

  return (
    <Menu.Root onSelect={handleSelect}>
      <Menu.Trigger asChild>
        <Flex
          alignItems="center"
          backgroundColor="transparent"
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
          cursor="pointer"
          gap="0.5rem"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box fontSize="14px">
            <PiHouseLight />
          </Box>
          <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            {name}
          </Box>
          {!isPublic && (
            <Box fontSize="14px" color="newGray.400" flexShrink={0}>
              <PiLockSimple />
            </Box>
          )}
          {isHovered && (
            <Box fontSize="12px" ml="0.25rem">
              <PiCaretDownBold />
            </Box>
          )}
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item color="gray.600" value="back">
              Back to projects
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
