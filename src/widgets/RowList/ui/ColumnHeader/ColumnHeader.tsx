import { Box, Flex, Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { LuArrowLeftToLine, LuArrowRightToLine, LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { PiEyeSlash, PiListBullets } from 'react-icons/pi'
import { useTruncatedTooltip } from 'src/shared/hooks/useTruncatedTooltip'
import { Tooltip } from 'src/shared/ui/Tooltip/tooltip'
import { useColumnResize } from 'src/widgets/RowList/hooks/useColumnResize'
import { getFieldTypeIcon } from 'src/widgets/RowList/lib/getFieldTypeIcon'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { SortModel } from 'src/widgets/RowList/model/SortModel'
import { ColumnType } from 'src/widgets/RowList/model/types'
import { FieldMenuItem } from 'src/widgets/RowList/ui/shared'
import { ColumnResizer } from './ColumnResizer'
import { SortIndicator } from './SortIndicator'
import { SortSubmenu } from './SortSubmenu'

interface ColumnHeaderProps {
  column: ColumnType
  columnsModel: ColumnsModel
  sortModel?: SortModel
}

export const ColumnHeader: FC<ColumnHeaderProps> = observer(({ column, columnsModel, sortModel }) => {
  const {
    ref: textRef,
    isOpen: tooltipOpen,
    onMouseEnter,
    onMouseLeave,
    onClose,
  } = useTruncatedTooltip<HTMLParagraphElement>()

  const width = columnsModel.getColumnWidth(column.id)
  const { isResizing, handleMouseDown: handleResizeMouseDown } = useColumnResize(column.id, columnsModel)

  const availableFields = columnsModel.availableFieldsToAdd
  const hasAvailableFields = availableFields.length > 0
  const canRemove = columnsModel.canRemoveColumn
  const canHideAll = columnsModel.canHideAll

  const canMoveLeft = columnsModel.canMoveLeft(column.id)
  const canMoveRight = columnsModel.canMoveRight(column.id)
  const canMoveToStart = columnsModel.canMoveToStart(column.id)
  const canMoveToEnd = columnsModel.canMoveToEnd(column.id)

  const handleRemove = useCallback(() => {
    columnsModel.removeColumn(column.id)
  }, [columnsModel, column.id])

  const handleInsertBefore = useCallback(
    (nodeId: string) => {
      columnsModel.insertColumnBefore(column.id, nodeId)
    },
    [columnsModel, column.id],
  )

  const handleInsertAfter = useCallback(
    (nodeId: string) => {
      columnsModel.insertColumnAfter(column.id, nodeId)
    },
    [columnsModel, column.id],
  )

  const handleMoveLeft = useCallback(() => {
    columnsModel.moveColumnLeft(column.id)
  }, [columnsModel, column.id])

  const handleMoveRight = useCallback(() => {
    columnsModel.moveColumnRight(column.id)
  }, [columnsModel, column.id])

  const handleMoveToStart = useCallback(() => {
    columnsModel.moveColumnToStart(column.id)
  }, [columnsModel, column.id])

  const handleMoveToEnd = useCallback(() => {
    columnsModel.moveColumnToEnd(column.id)
  }, [columnsModel, column.id])

  return (
    <Box
      as="th"
      textAlign="start"
      width={`${width}px`}
      maxWidth={`${width}px`}
      minWidth={`${width}px`}
      backgroundColor="white"
      position="relative"
    >
      <Menu.Root positioning={{ placement: 'bottom-end' }} lazyMount unmountOnExit>
        <Menu.Trigger asChild>
          <Flex
            alignItems="center"
            height="30px"
            borderBottomWidth="1px"
            borderColor="gray.100"
            pl="16px"
            pr="8px"
            gap="4px"
            cursor="pointer"
            transition="background 0.15s"
            _hover={{ bg: 'gray.50' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClose}
          >
            {column.fieldType && (
              <Box as="span" fontSize="xs" fontWeight="medium" color="gray.300" fontFamily="mono" flexShrink={0} mr={1}>
                {getFieldTypeIcon(column.fieldType)}
              </Box>
            )}
            <Tooltip content={column.title} open={tooltipOpen} positioning={{ placement: 'top' }}>
              <Text
                ref={textRef}
                flex={1}
                minWidth={0}
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                color="gray.400"
                fontSize="sm"
              >
                {column.title}
              </Text>
            </Tooltip>
            {sortModel && <SortIndicator columnId={column.id} sortModel={sortModel} />}
          </Flex>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="180px">
              {sortModel && (
                <>
                  <SortSubmenu columnId={column.id} sortModel={sortModel} />
                  <Menu.Separator />
                </>
              )}
              {(canMoveLeft || canMoveRight) && (
                <>
                  <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }} lazyMount unmountOnExit>
                    <Menu.TriggerItem>
                      <Text flex={1}>Move column</Text>
                      <LuChevronRight />
                    </Menu.TriggerItem>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content minW="160px">
                          {canMoveLeft && (
                            <Menu.Item value="move-left" onClick={handleMoveLeft}>
                              <LuChevronLeft />
                              <Text>Move left</Text>
                            </Menu.Item>
                          )}
                          {canMoveToStart && (
                            <Menu.Item value="move-to-start" onClick={handleMoveToStart}>
                              <LuArrowLeftToLine />
                              <Text>Move to start</Text>
                            </Menu.Item>
                          )}
                          {canMoveRight && (
                            <Menu.Item value="move-right" onClick={handleMoveRight}>
                              <LuChevronRight />
                              <Text>Move right</Text>
                            </Menu.Item>
                          )}
                          {canMoveToEnd && (
                            <Menu.Item value="move-to-end" onClick={handleMoveToEnd}>
                              <LuArrowRightToLine />
                              <Text>Move to end</Text>
                            </Menu.Item>
                          )}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                  <Menu.Separator />
                </>
              )}
              {hasAvailableFields && (
                <>
                  <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }} lazyMount unmountOnExit>
                    <Menu.TriggerItem>
                      <Text flex={1}>Insert before</Text>
                      <LuChevronRight />
                    </Menu.TriggerItem>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content maxH="300px" minW="200px">
                          {availableFields.map((field) => (
                            <FieldMenuItem
                              key={field.nodeId}
                              nodeId={field.nodeId}
                              name={field.name}
                              fieldType={field.fieldType}
                              valuePrefix="before"
                              onClick={handleInsertBefore}
                            />
                          ))}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                  <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }} lazyMount unmountOnExit>
                    <Menu.TriggerItem>
                      <Text flex={1}>Insert after</Text>
                      <LuChevronRight />
                    </Menu.TriggerItem>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content maxH="300px" minW="200px">
                          {availableFields.map((field) => (
                            <FieldMenuItem
                              key={field.nodeId}
                              nodeId={field.nodeId}
                              name={field.name}
                              fieldType={field.fieldType}
                              valuePrefix="after"
                              onClick={handleInsertAfter}
                            />
                          ))}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                  <Menu.Separator />
                </>
              )}
              <Menu.Item value="hide" disabled={!canRemove} onClick={handleRemove}>
                <PiEyeSlash />
                <Text>Hide column</Text>
              </Menu.Item>
              <Menu.Item value="hide-all" disabled={!canHideAll} onClick={columnsModel.hideAll}>
                <PiListBullets />
                <Text>Hide all columns</Text>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ColumnResizer isResizing={isResizing} onMouseDown={handleResizeMouseDown} />
    </Box>
  )
})
