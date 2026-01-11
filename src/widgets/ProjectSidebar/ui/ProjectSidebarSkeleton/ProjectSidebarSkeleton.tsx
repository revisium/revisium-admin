import { Box, Flex, Separator, Skeleton, Spacer, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { ProjectHeader } from 'src/widgets/ProjectSidebar/ui/ProjectButton/ProjectButton.tsx'
import { AccountButton } from 'src/widgets/AccountButton'

interface ProjectSidebarSkeletonProps {
  projectName: string
  organizationId: string
}

const SkeletonRowWithIcon: FC<{ width: string }> = ({ width }) => (
  <Flex alignItems="center" height="36px" paddingX="8px" gap="12px">
    <Skeleton height="20px" width="20px" borderRadius="sm" />
    <Skeleton height="14px" width={width} borderRadius="sm" />
  </Flex>
)

const SkeletonRowText: FC<{ width: string }> = ({ width }) => (
  <Flex alignItems="center" height="36px" paddingX="8px">
    <Skeleton height="14px" width={width} borderRadius="sm" />
  </Flex>
)

export const ProjectSidebarSkeleton: FC<ProjectSidebarSkeletonProps> = ({ projectName, organizationId }) => {
  return (
    <VStack alignItems="flex-start" gap={0} width="100%" flex={1}>
      <ProjectHeader name={projectName} organizationName={organizationId} isPublic={true} roleName={null} />

      <Box width="100%" paddingY="16px">
        <Separator borderColor="newGray.100" />
      </Box>

      <Flex flexDirection="column" width="100%" gap={1}>
        <SkeletonRowWithIcon width="60px" />
        <SkeletonRowText width="70px" />
        <SkeletonRowWithIcon width="80px" />
        <SkeletonRowWithIcon width="70px" />
        <SkeletonRowWithIcon width="90px" />
        <SkeletonRowWithIcon width="90px" />
        <SkeletonRowText width="85px" />
        <SkeletonRowText width="85px" />
      </Flex>

      <Spacer />

      <Flex flexDirection="column" width="100%" gap={1}>
        <AccountButton />
      </Flex>
    </VStack>
  )
}
