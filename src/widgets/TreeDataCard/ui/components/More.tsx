import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { PiDotsThreeOutlineFill } from 'react-icons/pi'

interface MoreProps {
  onClick?: () => void
  label: string
}

export const More: FC<MoreProps> = ({ onClick, label }) => {
  return (
    <Text ml="8px" color="gray.300" onClick={onClick} cursor="pointer">
      {label}
    </Text>
  )

  return (
    <Flex ml="8px" width="24px" height="100%" alignItems="center">
      <Flex
        bg="gray.50"
        borderColor="gray.200"
        borderWidth="1px"
        borderStyle="solid"
        color="gray.400"
        width="100%"
        height="14px"
        borderRadius="4px"
        onClick={onClick}
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
      >
        <PiDotsThreeOutlineFill size={12} />
      </Flex>
    </Flex>
  )
}
