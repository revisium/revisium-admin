import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { CreateProjectButton } from 'src/features/CreateProjectButton'
import { CreateProjectCard } from 'src/features/CreateProjectCard'
import { OrganizationPageViewModel } from 'src/pages/OrganizationPage/model/OrganizationPageViewModel.ts'
import { OrganizationProjectItemViewModel } from 'src/pages/OrganizationPage/model/OrganizationProjectItemViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'

const ProjectListItem: FC<{ model: OrganizationProjectItemViewModel }> = observer(({ model }) => {
  return (
    <Box height="2.5rem" width="100%">
      <Flex _hover={{ backgroundColor: 'gray.50' }} alignItems="center" gap="4px" paddingLeft="1rem">
        <Flex alignItems="center" flex={1} justifyContent="space-between" minHeight="40px">
          <Flex minWidth="150px">
            <Text _hover={{ textDecoration: 'underline' }}>
              <Link to={model.link}>{model.name}</Link>
            </Text>
            {model.touched && (
              <Text color="gray.400" ml="4px">
                *
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
})

export const OrganizationPage: FC = observer(() => {
  const model = useViewModel(OrganizationPageViewModel)

  return (
    <Page sidebar={<OrganizationSidebar />}>
      <Flex flex={1} flexDirection="column" gap="0.5rem" paddingBottom="1rem">
        {model.isCreatingProject ? (
          <CreateProjectCard onComplete={model.handleProjectCreated} />
        ) : (
          <>
            {model.canCreateProject && <CreateProjectButton onClick={model.toggleCreatingProject} />}

            {model.showLoading && (
              <VStack flex={1} justifyContent="center">
                <Spinner size="md" color="gray.400" />
              </VStack>
            )}

            {model.showError && (
              <VStack flex={1} justifyContent="center" gap="8px" color="gray.400">
                <Text fontSize="md">Could not load projects</Text>
                <Text fontSize="sm">Please retry later</Text>
              </VStack>
            )}

            {model.showEmpty && (
              <VStack flex={1} justifyContent="center" gap="8px" color="gray.400">
                <Text fontSize="md">No projects yet</Text>
              </VStack>
            )}

            {model.showList && (
              <Virtuoso
                useWindowScroll
                totalCount={model.totalCount}
                defaultItemHeight={40}
                endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
                itemContent={(index) => {
                  const item = model.items[index]
                  if (!item) {
                    return null
                  }
                  return <ProjectListItem key={item.id} model={item} />
                }}
              />
            )}
          </>
        )}
      </Flex>
    </Page>
  )
})
