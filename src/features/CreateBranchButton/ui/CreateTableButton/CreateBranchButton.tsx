import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface CreateBranchButtonProps {
  onClick: () => void
}

export const CreateBranchButton: React.FC<CreateBranchButtonProps> = ({ onClick }) => {
  return (
    <Button
      _hover={{ backgroundColor: 'gray.50' }}
      alignSelf="flex-start"
      color="gray.400"
      fontWeight="normal"
      height="2.5rem"
      variant="ghost"
      onClick={onClick}
    >
      <Flex alignItems="center" gap="0.5rem">
        <AddIcon boxSize={3} />
        <Text>Branch</Text>
      </Flex>
    </Button>
  )
}
