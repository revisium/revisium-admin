import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { MeProjectListItemViewModel } from 'src/widgets/MeProjectList/model/MeProjectListItemViewModel.ts'

interface ProjectListItemProps {
  model: MeProjectListItemViewModel
}

export const ProjectListItem: FC<ProjectListItemProps> = observer(({ model }) => {
  return (
    <Box height="2.5rem" width="100%">
      <Flex
        _hover={{ backgroundColor: 'gray.50' }}
        alignItems="center"
        gap="4px"
        paddingLeft="1rem"
        data-testid={`project-${model.name}`}
      >
        <Flex alignItems="center" flex={1} justifyContent="space-between" minHeight="40px">
          <Flex minWidth="150px">
            <Flex gap="4px">
              <Text color="gray.300">{model.organizationId}</Text>
              <Text color="gray.300">/</Text>
              <Text _hover={{ textDecoration: 'underline' }}>
                <Link to={model.link} data-testid={`project-${model.organizationId}-${model.name}-link`}>
                  {model.name}
                </Link>
              </Text>
            </Flex>
            {model.touched && '*'}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
})
