import { Box, Flex } from '@chakra-ui/react'
import { FC } from 'react'
import { MdOutlineChevronRight } from 'react-icons/md'
import { PiDotOutlineFill } from 'react-icons/pi'

export interface DotProps {
  isCollapsed?: boolean
  isCollapsible?: boolean
  toggleCollapsed?: () => void
}

export const Dot: FC<DotProps> = ({ isCollapsed, isCollapsible, toggleCollapsed }) => {
  return (
    <>
      {!isCollapsed && (
        <Flex
          color="gray.300"
          width="16px"
          height="28px"
          _groupHover={{
            display: isCollapsible ? 'none' : 'flex',
          }}
          alignItems="center"
          justifyContent="center"
        >
          <PiDotOutlineFill />
        </Flex>
      )}
      {isCollapsible && (
        <Flex
          _groupHover={{
            display: 'inline-flex',
            color: 'newGray.500',
          }}
          display={isCollapsed ? 'inline-flex' : 'none'}
          _hover={{
            backgroundColor: 'transparent',
          }}
          color="newGray.400"
          onClick={toggleCollapsed}
          width="16px"
          height="28px"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
        >
          <Box rotate={isCollapsed ? '0' : '90deg'}>
            <MdOutlineChevronRight size={16} />
          </Box>
        </Flex>
      )}
    </>
  )
}
