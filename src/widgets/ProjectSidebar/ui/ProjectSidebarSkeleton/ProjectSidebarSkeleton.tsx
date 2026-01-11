import { Box, Flex, Separator, Skeleton, Spacer, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { ProjectHeader } from 'src/widgets/ProjectSidebar/ui/ProjectButton/ProjectButton.tsx'
import { AccountButton } from 'src/widgets/AccountButton'

interface ProjectSidebarSkeletonProps {
  projectName: string
  organizationId: string
}

export const ProjectSidebarSkeleton: FC<ProjectSidebarSkeletonProps> = ({ projectName, organizationId }) => {
  return (
    <VStack alignItems="flex-start" gap={0} width="100%" flex={1}>
      <ProjectHeader name={projectName} organizationName={organizationId} isPublic={true} roleName={null} />

      <Box width="100%" paddingY="16px">
        <Separator borderColor="newGray.100" />
      </Box>

      <Flex flexDirection="column" width="100%" gap={1}>
        <Skeleton height="36px" width="100%" borderRadius="md" />

        <Box mt={2}>
          <Skeleton height="36px" width="100%" borderRadius="md" />
          <Box pl={4} mt={1}>
            <Skeleton height="32px" width="100%" borderRadius="md" mb={1} />
            <Skeleton height="32px" width="100%" borderRadius="md" mb={1} />
            <Skeleton height="32px" width="100%" borderRadius="md" />
          </Box>
        </Box>

        <Box mt={2}>
          <Skeleton height="36px" width="100%" borderRadius="md" />
          <Box pl={4} mt={1}>
            <Skeleton height="32px" width="100%" borderRadius="md" mb={1} />
            <Skeleton height="32px" width="100%" borderRadius="md" mb={1} />
            <Skeleton height="32px" width="100%" borderRadius="md" />
          </Box>
        </Box>
      </Flex>

      <Spacer />

      <Flex flexDirection="column" width="100%" gap={1}>
        <AccountButton />
      </Flex>
    </VStack>
  )
}
