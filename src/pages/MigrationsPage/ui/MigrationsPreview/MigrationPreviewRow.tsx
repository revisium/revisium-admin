import { Box, Button, Flex, Icon, Popover, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { diffStatusColors, diffStatusIcons } from 'src/pages/MigrationsPage/config/operationIcons.ts'
import { MigrationDiffItem } from 'src/pages/MigrationsPage/config/types.ts'
import { getMigrationSummary, getStatusLabel } from 'src/pages/MigrationsPage/lib/migrationFormatters.ts'
import { formatDate } from 'src/shared/lib/helpers/formatDate.ts'

interface MigrationPreviewRowProps {
  item: MigrationDiffItem
  index: number
  isLast: boolean
  canRemove: boolean
  onRemove?: () => void
}

export const MigrationPreviewRow: FC<MigrationPreviewRowProps> = observer(
  ({ item, index, isLast, canRemove, onRemove }) => {
    const StatusIcon = diffStatusIcons[item.status]
    const statusColor = diffStatusColors[item.status]

    const canClick = isLast && canRemove && onRemove && item.status === 'apply'
    const [popoverOpen, setPopoverOpen] = useState(false)

    const row = (
      <Flex
        align="center"
        height="40px"
        px={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        _hover={{ bg: canClick ? 'red.50' : 'gray.50' }}
        gap={3}
        cursor={canClick ? 'pointer' : 'default'}
      >
        <Text fontSize="sm" color="gray.400" minWidth="24px">
          {index + 1}
        </Text>

        <Flex align="center" gap={2} minWidth="90px">
          <Icon as={StatusIcon} color={statusColor} boxSize={4} />
          <Text fontSize="sm" color={statusColor} fontWeight="500">
            {getStatusLabel(item.status)}
          </Text>
        </Flex>

        <Box flex={1} overflow="hidden">
          <Text fontSize="sm" color="gray.700" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            {getMigrationSummary(item)}
            {item.reason && item.status !== 'apply' && (
              <Text as="span" fontSize="xs" color="gray.400" ml={2}>
                ({item.reason})
              </Text>
            )}
          </Text>
        </Box>

        <Text fontSize="xs" color="gray.400" minWidth="100px">
          {formatDate(item.migration.id, 'dd.MM.yyyy HH:mm')}
        </Text>
      </Flex>
    )

    if (!canClick) {
      return row
    }

    return (
      <Popover.Root open={popoverOpen} onOpenChange={(e) => setPopoverOpen(e.open)}>
        <Popover.Trigger asChild>{row}</Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content width="auto">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body p={3}>
              <Flex direction="column" gap={2}>
                <Text fontSize="sm">Exclude this migration from apply?</Text>
                <Flex gap={2} justify="flex-end">
                  <Button size="xs" variant="outline" onClick={() => setPopoverOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    colorPalette="red"
                    onClick={() => {
                      setPopoverOpen(false)
                      onRemove?.()
                    }}
                  >
                    Exclude
                  </Button>
                </Flex>
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    )
  },
)
