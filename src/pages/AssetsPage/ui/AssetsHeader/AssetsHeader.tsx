import { Box, HStack, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { AssetsFilterModel } from 'src/pages/AssetsPage/model/AssetsFilterModel'
import { AssetsFilter } from 'src/pages/AssetsPage/ui/AssetsFilter/AssetsFilter'
import { FileOrganizationInfo } from 'src/pages/AssetsPage/ui/FileOrganizationInfo/FileOrganizationInfo'

interface AssetsHeaderProps {
  branchName: string
  tablesCount: number
  filesCount: number
  filterModel?: AssetsFilterModel
}

export const AssetsHeader: FC<AssetsHeaderProps> = observer(({ branchName, tablesCount, filesCount, filterModel }) => {
  return (
    <Box pt={4} pb={6}>
      <HStack justify="space-between" align="center" mb={1} flexWrap="wrap" gap={2}>
        <Text fontSize="20px" fontWeight="600" color="newGray.500">
          Assets for {branchName}
        </Text>
        {filterModel && <AssetsFilter model={filterModel} />}
      </HStack>

      <HStack gap={1}>
        <Text fontSize="xs" color="newGray.400">
          Browse {filesCount} {filesCount === 1 ? 'file' : 'files'} in {tablesCount}{' '}
          {tablesCount === 1 ? 'table' : 'tables'}.
        </Text>
        <FileOrganizationInfo />
      </HStack>
    </Box>
  )
})
