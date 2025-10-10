import { Flex } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

interface IconBoxProps {
  children: ReactNode
  dataTestId?: string
  onClick?: () => void
}

export const IconBox: FC<IconBoxProps> = ({ dataTestId, onClick, children }) => {
  return (
    <Flex
      height="24px"
      width="24px"
      justifyContent="center"
      alignItems="center"
      _groupHover={{
        color: 'black',
      }}
      color="gray.500"
      _hover={{ backgroundColor: 'gray.100' }}
      borderRadius="4px"
      cursor={onClick ? 'pointer' : 'default'}
      data-testid={dataTestId}
      onClick={onClick}
    >
      {children}
    </Flex>
  )
}
