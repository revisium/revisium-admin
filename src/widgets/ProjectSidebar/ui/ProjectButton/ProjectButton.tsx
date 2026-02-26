import { Box, Flex, Spacer } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCaretCircleLeftLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { SidebarToggleButton } from 'src/shared/ui'
import { VisibilityBadge } from 'src/widgets/ProjectSidebar/ui/VisibilityBadge/VisibilityBadge.tsx'

interface ProjectHeaderProps {
  name: string
  organizationName: string
  isPublic?: boolean
  roleName: string | null
}

export const ProjectHeader: FC<ProjectHeaderProps> = observer(({ name, organizationName, isPublic, roleName }) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <Flex className="group" flexDirection="column" alignItems="flex-start" width="100%" minWidth="0">
      <Flex alignItems="center" gap="8px" padding="4px" width="100%" minWidth={0}>
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
        <Flex alignItems="center" gap="4px" minWidth={0} flex={1}>
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
          {isPublic !== undefined && <VisibilityBadge isPublic={isPublic} roleName={roleName} />}
        </Flex>
        <Spacer />
        <SidebarToggleButton />
      </Flex>
      <Flex
        color="newGray.400"
        fontWeight="500"
        fontSize="14px"
        lineHeight="20px"
        padding="4px"
        alignItems="center"
        width="100%"
        minWidth={0}
      >
        <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {organizationName}
        </Box>
      </Flex>
    </Flex>
  )
})
