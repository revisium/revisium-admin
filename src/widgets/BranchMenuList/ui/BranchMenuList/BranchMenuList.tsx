import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useMenuListModel } from 'src/widgets/BranchMenuList/hooks/useMenuListModel.ts'

export const BranchMenuList: FC = observer(() => {
  const store = useMenuListModel()

  return (
    <VStack alignItems="flex-start" gap="1rem">
      <Link to="/">
        <Button variant="link" data-testid="sidebar-back-to-projects-button">
          <Heading color="gray" size="md">
            <b>{store.projectName}</b>
          </Heading>
        </Button>
      </Link>
      <VStack
        alignItems="flex-start"
        borderTop="1px solid"
        borderTopColor="gray.100"
        gap="0.25rem"
        pb="1rem"
        pt="1rem"
        width="100%"
      >
        <Text color="gray" fontSize="sm" mb="0.5rem">
          Branches:
        </Text>
        {store.items.map((branchLink) => (
          <Flex
            _hover={branchLink.isActive ? {} : { backgroundColor: 'gray.200' }}
            alignItems="center"
            backgroundColor={branchLink.isActive ? 'gray.100' : undefined}
            borderRadius="0.25rem"
            height="32px"
            key={branchLink.id}
            paddingLeft="0.5rem"
            width="100%"
          >
            {branchLink.isActive ? (
              <Text color="gray.500" fontWeight="600">
                {branchLink.title}
              </Text>
            ) : (
              <Button minWidth={0} variant="link">
                <Text>
                  <Link key={branchLink.id} to={branchLink.link} data-testid={`sidebar-branch-${branchLink.name}`}>
                    {branchLink.title}
                  </Link>
                </Text>
              </Button>
            )}

            {branchLink.touched && <Text color="gray.600">*</Text>}
          </Flex>
        ))}
      </VStack>
    </VStack>
  )
})
