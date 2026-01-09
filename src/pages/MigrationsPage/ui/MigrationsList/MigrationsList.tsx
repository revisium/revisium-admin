import { Box, Flex, Icon, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { createContext, FC, useContext, useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { MigrationItemViewModel } from 'src/pages/MigrationsPage/model/MigrationItemViewModel.ts'
import { JsonCard } from 'src/shared/ui'

interface MigrationsListProps {
  items: MigrationItemViewModel[]
}

interface MigrationsListContextValue {
  items: MigrationItemViewModel[]
}

const MigrationsListContext = createContext<MigrationsListContextValue | null>(null)

const MigrationListItem: FC<{ index: number }> = observer(({ index }) => {
  const context = useContext(MigrationsListContext)
  if (!context) {
    return null
  }

  const item = context.items[index]
  if (!item) {
    return null
  }

  return (
    <Popover.Root
      lazyMount
      unmountOnExit
      positioning={{ placement: 'bottom-start' }}
      open={item.isPopoverOpen}
      onOpenChange={({ open }) => item.setPopoverOpen(open)}
    >
      <Popover.Trigger asChild>
        <Box
          py={3}
          px={4}
          cursor="pointer"
          borderBottom="1px solid"
          borderColor="gray.50"
          _hover={{
            bg: 'gray.50',
            '& .migration-icon': { color: 'newGray.400' },
          }}
          data-testid={`migration-item-${index}`}
        >
          <Flex align="center" gap={2}>
            <Icon as={item.descriptionIcon} className="migration-icon" color="newGray.300" boxSize={4} flexShrink={0} />
            <Text fontSize="sm" color="newGray.500" lineHeight="1.4" flex={1} minWidth={0}>
              {item.descriptionSegments.map((segment, i) => {
                if (segment.highlight) {
                  return (
                    <Box key={i} as="span" px="1" bg="gray.100" borderRadius="sm" whiteSpace="nowrap">
                      {segment.text}
                    </Box>
                  )
                }
                if (segment.gray) {
                  return (
                    <Box key={i} as="span" color="newGray.300">
                      {segment.text}
                    </Box>
                  )
                }
                return <span key={i}>{segment.text}</span>
              })}
            </Text>
            <Text fontSize="xs" color="newGray.300" flexShrink={0} whiteSpace="nowrap">
              {item.relativeTime}
            </Text>
          </Flex>
        </Box>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content width="800px" maxHeight="350px" overflow="auto">
            <Popover.CloseTrigger />
            <Popover.Body>
              <JsonCard readonly data={item.fullPatchData} />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})

export const MigrationsList: FC<MigrationsListProps> = observer(({ items }) => {
  const contextValue = useMemo(() => ({ items }), [items])

  if (items.length === 0) {
    return (
      <Flex justify="center" align="center" minHeight="200px">
        <Text color="gray.400">No operations found</Text>
      </Flex>
    )
  }

  return (
    <MigrationsListContext.Provider value={contextValue}>
      <Virtuoso
        useWindowScroll
        totalCount={items.length}
        defaultItemHeight={52}
        increaseViewportBy={52 * 20}
        itemContent={(index) => <MigrationListItem index={index} />}
      />
    </MigrationsListContext.Provider>
  )
})
