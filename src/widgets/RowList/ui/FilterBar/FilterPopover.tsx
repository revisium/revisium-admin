import { Badge, Box, Button, IconButton, Popover, Portal } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuFilter } from 'react-icons/lu'
import { FilterModel } from 'src/widgets/RowList/model/FilterModel'
import { FilterGroupComponent } from './FilterGroupComponent'

interface FilterPopoverProps {
  filterModel: FilterModel
  anchorRef: React.RefObject<HTMLDivElement | null>
}

export const FilterPopover: FC<FilterPopoverProps> = observer(({ filterModel, anchorRef }) => {
  const handleApply = () => {
    const success = filterModel.apply()
    if (success) {
      filterModel.closeFilterBar()
    }
  }

  const handleOpenChange = ({ open }: { open: boolean }) => {
    if (open) {
      filterModel.openFilterBar()
    } else {
      filterModel.closeFilterBar()
    }
  }

  const showBadge = filterModel.hasAppliedFilters || filterModel.hasPendingChanges
  const badgeColor = filterModel.hasPendingChanges ? 'orange' : 'gray'

  return (
    <Popover.Root
      open={filterModel.isFilterBarOpen}
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
            aria-label="Toggle filters"
            size="sm"
            variant={filterModel.isFilterBarOpen ? 'subtle' : 'ghost'}
            colorPalette="gray"
          >
            <LuFilter />
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
            {filterModel.filterCount}
          </Badge>
        )}
      </Box>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width={anchorRef.current?.offsetWidth ? `${anchorRef.current.offsetWidth}px` : 'auto'}
            p={0}
            borderRadius="md"
            boxShadow="lg"
          >
            <Box borderWidth={1} borderColor="newGray.100" borderRadius="md" p={3} bg="white">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box color="newGray.400">
                    <LuFilter size={14} />
                  </Box>
                  <Box as="span" fontWeight="medium" fontSize="sm" color="newGray.600">
                    Filters
                  </Box>
                  {filterModel.filterCount > 0 && (
                    <Badge colorPalette="gray" size="sm" variant="subtle">
                      {filterModel.filterCount}
                    </Badge>
                  )}
                  {filterModel.hasPendingChanges && (
                    <Badge colorPalette="orange" size="sm" variant="subtle">
                      unsaved
                    </Badge>
                  )}
                </Box>
                <Box display="flex" gap={2}>
                  {filterModel.hasFilters && (
                    <Button size="xs" variant="ghost" colorPalette="gray" onClick={filterModel.reset}>
                      Clear all
                    </Button>
                  )}
                  <Button
                    size="xs"
                    variant="subtle"
                    colorPalette="gray"
                    onClick={handleApply}
                    disabled={!filterModel.hasPendingChanges}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>

              <FilterGroupComponent filterModel={filterModel} group={filterModel.rootGroup} isRoot />
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
