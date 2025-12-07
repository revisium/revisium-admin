import { Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { LuArrowDownAZ, LuArrowUpAZ, LuChevronRight, LuX } from 'react-icons/lu'
import { SortDirection } from 'src/widgets/RowList/config/sortTypes'
import { SortModel } from 'src/widgets/RowList/model/SortModel'

interface SortSubmenuProps {
  columnId: string
  sortModel: SortModel
}

export const SortSubmenu: FC<SortSubmenuProps> = observer(({ columnId, sortModel }) => {
  const isSorted = sortModel.isSorted(columnId)
  const currentDirection = sortModel.getSortDirection(columnId)

  const handleSort = useCallback(
    (direction: SortDirection) => {
      sortModel.setSortAndApply(columnId, direction)
    },
    [sortModel, columnId],
  )

  const handleRemoveSort = useCallback(() => {
    sortModel.removeSortAndApply(columnId)
  }, [sortModel, columnId])

  return (
    <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }} lazyMount unmountOnExit>
      <Menu.TriggerItem>
        <Text flex={1}>Sort</Text>
        <LuChevronRight />
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="160px">
            <Menu.Item
              value="sort-asc"
              onClick={() => handleSort('asc')}
              color={currentDirection === 'asc' ? 'blue.600' : undefined}
            >
              <LuArrowUpAZ />
              <Text>Sort A → Z</Text>
            </Menu.Item>
            <Menu.Item
              value="sort-desc"
              onClick={() => handleSort('desc')}
              color={currentDirection === 'desc' ? 'blue.600' : undefined}
            >
              <LuArrowDownAZ />
              <Text>Sort Z → A</Text>
            </Menu.Item>
            {isSorted && (
              <>
                <Menu.Separator />
                <Menu.Item value="remove-sort" onClick={handleRemoveSort}>
                  <LuX />
                  <Text>Remove sort</Text>
                </Menu.Item>
              </>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
})
