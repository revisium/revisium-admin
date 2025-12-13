import { Box, Flex, Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import { LuFilter, LuText } from 'react-icons/lu'
import { FilterableField, SystemFieldId } from 'src/widgets/RowList/model/filterTypes'
import { FilterModel } from 'src/widgets/RowList/model/FilterModel'
import { SortModel } from 'src/widgets/RowList/model/SortModel'
import { AddFilterPopover } from './AddFilterPopover'
import { ColumnResizer } from './ColumnResizer'
import { SortIndicator } from './SortIndicator'
import { SortSubmenu } from './SortSubmenu'

interface IdColumnHeaderProps {
  width: number
  left: number | string
  isResizing: boolean
  onResizeMouseDown: (e: React.MouseEvent) => void
  sortModel?: SortModel
  filterModel?: FilterModel
}

export const IdColumnHeader: FC<IdColumnHeaderProps> = observer(
  ({ width, left, isResizing, onResizeMouseDown, sortModel, filterModel }) => {
    const headerRef = useRef<HTMLTableCellElement>(null)
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false)

    const idFilterField: FilterableField | undefined =
      filterModel?.systemFields.find((f) => f.systemFieldId === SystemFieldId.Id) ||
      filterModel?.availableFields.find((f) => f.systemFieldId === SystemFieldId.Id)

    const canFilter = Boolean(idFilterField)

    const handleOpenFilterPopover = useCallback(() => {
      setIsFilterPopoverOpen(true)
    }, [])

    const handleCloseFilterPopover = useCallback(() => {
      setIsFilterPopoverOpen(false)
    }, [])

    return (
      <Box
        ref={headerRef}
        as="th"
        backgroundColor="white"
        position="sticky"
        left={left}
        zIndex={1}
        width={`${width}px`}
        maxWidth={`${width}px`}
        minWidth={`${width}px`}
        textAlign="start"
        transition="left 0.15s"
      >
        <Menu.Root positioning={{ placement: 'bottom-end' }} lazyMount unmountOnExit>
          <Menu.Trigger asChild>
            <Flex
              alignItems="center"
              height="30px"
              borderBottomWidth="1px"
              borderColor="gray.100"
              pl="8px"
              pr="8px"
              gap="4px"
              cursor="pointer"
              transition="background 0.15s"
              _hover={{ bg: 'gray.50' }}
            >
              <Box as={LuText} fontSize="xs" color="gray.300" flexShrink={0} />
              <Text
                flex={1}
                color="gray.400"
                fontSize="sm"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                id
              </Text>
              {sortModel && <SortIndicator columnId={SystemFieldId.Id} sortModel={sortModel} />}
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="180px">
                {sortModel && (
                  <>
                    <SortSubmenu columnId={SystemFieldId.Id} sortModel={sortModel} />
                    <Menu.Separator />
                  </>
                )}
                {canFilter && (
                  <Menu.Item value="add-filter" onClick={handleOpenFilterPopover}>
                    <LuFilter />
                    <Text>Add filter</Text>
                  </Menu.Item>
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <ColumnResizer isResizing={isResizing} onMouseDown={onResizeMouseDown} />
        {filterModel && idFilterField && (
          <AddFilterPopover
            field={idFilterField}
            filterModel={filterModel}
            isOpen={isFilterPopoverOpen}
            onClose={handleCloseFilterPopover}
            anchorRef={headerRef}
          />
        )}
      </Box>
    )
  },
)
