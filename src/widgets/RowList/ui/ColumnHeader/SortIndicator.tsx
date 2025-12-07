import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuArrowDown, LuArrowUp } from 'react-icons/lu'
import { SortModel } from 'src/widgets/RowList/model/SortModel'

interface SortIndicatorProps {
  columnId: string
  sortModel: SortModel
}

export const SortIndicator: FC<SortIndicatorProps> = observer(({ columnId, sortModel }) => {
  const direction = sortModel.getSortDirection(columnId)
  const sortIndex = sortModel.getSortIndex(columnId)
  const showIndex = sortModel.sortCount > 1

  if (!direction) {
    return null
  }

  return (
    <Flex alignItems="center" gap="1px" color="blue.500" fontSize="xs" flexShrink={0}>
      {direction === 'asc' ? <LuArrowUp size={12} /> : <LuArrowDown size={12} />}
      {showIndex && (
        <Box as="span" fontSize="10px" fontWeight="medium" lineHeight={1}>
          {sortIndex}
        </Box>
      )}
    </Flex>
  )
})
