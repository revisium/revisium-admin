import { Box, Flex, Text, HStack, Badge } from '@chakra-ui/react'
import { FC } from 'react'
import { SearchItemModel } from 'src/widgets/SearchModal/model/SearchItemModel.ts'

interface SearchResultItemProps {
  model: SearchItemModel
  isSelected: boolean
  onClick: () => void
}

export const SearchResultItem: FC<SearchResultItemProps> = ({ model, isSelected, onClick }) => {
  return (
    <Box
      px={3}
      py={2.5}
      cursor="pointer"
      bg={isSelected ? 'newGray.50' : 'transparent'}
      _hover={{ bg: 'newGray.50' }}
      onClick={onClick}
      borderRadius="md"
      transition="background 0.1s"
    >
      <Flex direction="column" gap={1}>
        <HStack gap={2}>
          <Badge size="sm" colorPalette="blue" variant="subtle">
            {model.tableId}
          </Badge>
          <Text fontSize="xs" color="newGray.400">
            Row: {model.rowId}
          </Text>
        </HStack>
        <Box>
          <Text fontSize="xs" color="newGray.400" mb={1}>
            {model.path}
          </Text>
          <Text fontSize="sm" color="newGray.600" lineClamp={2} dangerouslySetInnerHTML={{ __html: model.highlight }} />
        </Box>
      </Flex>
    </Box>
  )
}
