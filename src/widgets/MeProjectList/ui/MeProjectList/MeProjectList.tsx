import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'

import { DeleteProjectButton } from 'src/features/DeleteProjectButton'
import { useProjectListModel } from 'src/widgets/MeProjectList/hooks/useProjectListModel.ts'

import styles from 'src/widgets/MeProjectList/ui/MeProjectList/MeProjectList.module.scss'

export const MeProjectList: FC = observer(() => {
  const store = useProjectListModel()

  return (
    <Virtuoso
      useWindowScroll
      totalCount={store.totalCount}
      defaultItemHeight={40}
      endReached={store.hasNextPage ? store.tryToFetchNextPage : undefined}
      itemContent={(index) => {
        const project = store.items[index]

        return (
          <Box height="2.5rem" key={project.id} width="100%">
            <Flex
              _hover={{ backgroundColor: 'gray.50' }}
              alignItems="center"
              className={styles.Row}
              gap="4px"
              paddingLeft="1rem"
              data-testid={`project-${project.name}`}
            >
              <Flex alignItems="center" flex={1} justifyContent="space-between" minHeight="40px">
                <Flex minWidth="150px">
                  <Flex gap="4px">
                    <Text color="gray.300">{project.organizationId}</Text>
                    <Text color="gray.300">/</Text>
                    <Text _hover={{ textDecoration: 'underline' }}>
                      <Link to={project.link} data-testid={`project-${project.organizationId}-${project.name}-link`}>
                        {project.name}
                      </Link>
                    </Text>
                  </Flex>
                  {project.touched ? '*' : ''}
                </Flex>
                <Box className={styles.RemoveRowButton}>
                  <DeleteProjectButton organizationId={project.organizationId} projectName={project.name} />
                </Box>
              </Flex>
            </Flex>
          </Box>
        )
      }}
    />
  )
})
