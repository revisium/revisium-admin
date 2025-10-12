import { Flex, Text } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface SidebarLinkProps {
  label: string
  link: string
  isActive?: boolean
  touched?: boolean
  dataTestId?: string
}

export const SidebarLink: FC<SidebarLinkProps> = ({ label, link, isActive, touched, dataTestId }) => {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(link)
  }, [link, navigate])

  return (
    <Flex
      data-testid={dataTestId}
      alignItems="center"
      backgroundColor={isActive ? 'gray.900/4' : undefined}
      _hover={{ backgroundColor: 'gray.900/4' }}
      color={isActive ? 'black/70' : 'black/50'}
      borderRadius="0.25rem"
      height="30px"
      paddingLeft="0.5rem"
      paddingRight="0.5rem"
      width="100%"
      fontWeight="500"
      textDecoration="none"
      fontSize="16px"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      overflow="hidden"
      cursor="pointer"
      onClick={handleClick}
    >
      {label}
      {touched && <Text>*</Text>}
    </Flex>
  )
}
