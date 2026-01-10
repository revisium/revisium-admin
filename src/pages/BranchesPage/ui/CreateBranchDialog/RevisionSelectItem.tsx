import { Badge, Box, HStack, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { RevisionForSelect } from '../../api/CreateBranchDataSource.ts'

interface RevisionSelectItemProps {
  revision: RevisionForSelect
  isSelected: boolean
  onClick: () => void
}

export const RevisionSelectItem: FC<RevisionSelectItemProps> = ({ revision, isSelected, onClick }) => {
  const date = new Date(revision.createdAt).toLocaleString()
  const shortId = revision.id.slice(0, 7)

  return (
    <Box
      px={3}
      py={2}
      backgroundColor={isSelected ? 'blue.50' : 'transparent'}
      cursor="pointer"
      _hover={{ backgroundColor: isSelected ? 'blue.50' : 'newGray.50' }}
      transition="background-color 0.15s"
      onClick={onClick}
    >
      <HStack gap={3}>
        <Text fontSize="13px" color="newGray.500" fontFamily="mono" flexShrink={0}>
          {shortId}
        </Text>
        {revision.isHead && (
          <Badge size="sm" colorPalette="gray" variant="subtle" fontWeight="500">
            head
          </Badge>
        )}
        <Text fontSize="13px" color="newGray.600" flex={1} truncate>
          {revision.comment || ''}
        </Text>
        <Text fontSize="12px" color="newGray.400" flexShrink={0}>
          {date}
        </Text>
      </HStack>
    </Box>
  )
}
