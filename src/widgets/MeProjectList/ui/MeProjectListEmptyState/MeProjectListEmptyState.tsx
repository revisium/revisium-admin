import { Link, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'

interface MeProjectListEmptyStateProps {
  onCreate?: () => void
}

export const MeProjectListEmptyState: FC<MeProjectListEmptyStateProps> = ({ onCreate }) => {
  return (
    <VStack flex={1} justifyContent="center" gap="8px" color="gray.400">
      <Text fontSize="md">No projects yet</Text>
      {onCreate ? (
        <Link fontSize="sm" color="gray.500" _hover={{ color: 'gray.600' }} onClick={onCreate} cursor="pointer">
          Create your first project to get started
        </Link>
      ) : (
        <Text fontSize="sm">Create your first project to get started</Text>
      )}
    </VStack>
  )
}
