import { Badge, Box, Button, IconButton, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { LuArrowUpDown, LuPlus } from 'react-icons/lu'
import { SortDirection } from 'src/widgets/RowList/config/sortTypes'
import { SortModel } from 'src/widgets/RowList/model/SortModel'
import { SortConditionRow } from './SortConditionRow'

interface SortPopoverProps {
  sortModel: SortModel
  anchorRef: React.RefObject<HTMLDivElement | null>
}

export const SortPopover: FC<SortPopoverProps> = observer(({ sortModel, anchorRef }) => {
  const handleApply = () => {
    sortModel.apply()
    sortModel.close()
  }

  const handleClearAll = () => {
    sortModel.reset()
    sortModel.close()
  }

  const handleOpenChange = ({ open }: { open: boolean }) => {
    if (open) {
      sortModel.open()
    } else {
      sortModel.close()
    }
  }

  const handleAddSort = useCallback(() => {
    const fieldsNotInSort = sortModel.fieldsNotInSort
    if (fieldsNotInSort.length > 0) {
      sortModel.addSort(fieldsNotInSort[0].nodeId)
    }
  }, [sortModel])

  const handleFieldChange = useCallback(
    (oldNodeId: string, newNodeId: string) => {
      sortModel.replaceField(oldNodeId, newNodeId)
    },
    [sortModel],
  )

  const handleDirectionChange = useCallback(
    (nodeId: string, direction: SortDirection) => {
      sortModel.setSort(nodeId, direction)
    },
    [sortModel],
  )

  const handleRemove = useCallback(
    (nodeId: string) => {
      sortModel.removeSort(nodeId)
    },
    [sortModel],
  )

  const showBadge = sortModel.hasAppliedSorts || sortModel.hasPendingChanges
  const badgeColor = sortModel.hasPendingChanges ? 'orange' : 'gray'

  return (
    <Popover.Root
      open={sortModel.isOpen}
      onOpenChange={handleOpenChange}
      lazyMount
      unmountOnExit
      autoFocus={false}
      closeOnInteractOutside={true}
      modal={false}
      positioning={{
        placement: 'bottom-start',
        getAnchorRect: () => anchorRef.current?.getBoundingClientRect() || null,
      }}
    >
      <Box position="relative" display="inline-flex">
        <Popover.Trigger asChild>
          <IconButton
            aria-label="Toggle sorting"
            size="sm"
            variant={sortModel.isOpen ? 'subtle' : 'ghost'}
            colorPalette="gray"
            color={sortModel.hasAppliedSorts ? undefined : 'gray.300'}
          >
            <LuArrowUpDown />
          </IconButton>
        </Popover.Trigger>
        {showBadge && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorPalette={badgeColor}
            variant="solid"
            size="xs"
            borderRadius="full"
            minWidth="16px"
            height="16px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="10px"
          >
            {sortModel.sortCount}
          </Badge>
        )}
      </Box>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width={anchorRef.current?.offsetWidth ? `${anchorRef.current.offsetWidth}px` : 'auto'}
            minW="350px"
            p={0}
            borderRadius="md"
            boxShadow="lg"
          >
            <Box borderWidth={1} borderColor="newGray.100" borderRadius="md" p={3} bg="white">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box color="newGray.400">
                    <LuArrowUpDown size={14} />
                  </Box>
                  <Box as="span" fontWeight="medium" fontSize="sm" color="newGray.600">
                    Sort
                  </Box>
                  {sortModel.sortCount > 0 && (
                    <Badge colorPalette="gray" size="sm" variant="subtle">
                      {sortModel.sortCount}
                    </Badge>
                  )}
                  {sortModel.hasPendingChanges && (
                    <Badge colorPalette="orange" size="sm" variant="subtle">
                      unsaved
                    </Badge>
                  )}
                </Box>
                <Box display="flex" gap={2}>
                  {sortModel.hasSorts && (
                    <Button size="xs" variant="ghost" colorPalette="gray" onClick={handleClearAll}>
                      Clear all
                    </Button>
                  )}
                  <Button
                    size="xs"
                    variant="subtle"
                    colorPalette="gray"
                    onClick={handleApply}
                    disabled={!sortModel.hasPendingChanges}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>

              <Box>
                {sortModel.sorts.map((sort, index) => (
                  <SortConditionRow
                    key={sort.id}
                    sort={sort}
                    index={index}
                    availableFields={sortModel.availableFields}
                    onFieldChange={handleFieldChange}
                    onDirectionChange={handleDirectionChange}
                    onRemove={handleRemove}
                  />
                ))}
              </Box>

              {sortModel.canAddSort && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="gray"
                  onClick={handleAddSort}
                  mt={sortModel.hasSorts ? 1 : 0}
                >
                  <LuPlus size={14} />
                  <Text ml={1}>Add sort</Text>
                </Button>
              )}

              {!sortModel.hasSorts && !sortModel.canAddSort && (
                <Text fontSize="sm" color="gray.400" textAlign="center" py={2}>
                  No sortable fields available
                </Text>
              )}
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
