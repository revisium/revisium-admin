import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useRef } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { MigrationDiffItem } from 'src/pages/MigrationsPage/config/types.ts'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import { MigrationsViewSwitcher } from 'src/pages/MigrationsPage/ui/MigrationsViewSwitcher/MigrationsViewSwitcher.tsx'
import { JsonCard } from 'src/shared/ui'
import { MigrationPreviewRow } from './MigrationPreviewRow.tsx'

interface MigrationsPreviewProps {
  diffItems: MigrationDiffItem[]
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onRemoveLast?: () => void
  canRemoveLast?: boolean
  summary: {
    toApply: number
    toSkip: number
    conflicts: number
    blocked: number
  }
}

export const MigrationsPreview: FC<MigrationsPreviewProps> = observer(
  ({ diffItems, viewMode, onViewModeChange, onRemoveLast, canRemoveLast = false, summary }) => {
    const isTableMode = viewMode === ViewMode.Table
    const virtuosoRef = useRef<VirtuosoHandle>(null)

    useEffect(() => {
      if (diffItems.length > 0 && isTableMode) {
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({
            index: diffItems.length - 1,
            behavior: 'smooth',
          })
        }, 100)
      }
    }, [diffItems.length, isTableMode])

    const jsonData = useMemo(() => {
      return diffItems.map((item) => item.migration) as unknown as JsonValue
    }, [diffItems])

    if (diffItems.length === 0) {
      return (
        <Flex justify="center" align="center" minHeight="100px">
          <Text color="gray.400" fontSize="sm">
            No migrations to preview
          </Text>
        </Flex>
      )
    }

    return (
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between">
          <HStack gap={4}>
            <Text fontSize="sm" color="gray.600">
              <Text as="span" fontWeight="500" color="green.500">
                {summary.toApply}
              </Text>{' '}
              to apply
            </Text>
            {summary.toSkip > 0 && (
              <Text fontSize="sm" color="gray.400">
                {summary.toSkip} to skip
              </Text>
            )}
            {summary.conflicts > 0 && (
              <Text fontSize="sm" color="orange.500">
                {summary.conflicts} conflicts
              </Text>
            )}
            {summary.blocked > 0 && (
              <Text fontSize="sm" color="gray.400">
                {summary.blocked} blocked
              </Text>
            )}
          </HStack>
          <MigrationsViewSwitcher mode={viewMode} onChange={onViewModeChange} />
        </HStack>

        {isTableMode ? (
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
            height="300px"
            maxHeight="300px"
          >
            <Virtuoso
              ref={virtuosoRef}
              style={{ height: '100%' }}
              totalCount={diffItems.length}
              data={diffItems}
              itemContent={(index, item) => (
                <MigrationPreviewRow
                  item={item}
                  index={index}
                  isLast={index === diffItems.length - 1}
                  canRemove={canRemoveLast}
                  onRemove={onRemoveLast}
                />
              )}
            />
          </Box>
        ) : (
          <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="auto" maxHeight="300px">
            <JsonCard readonly data={jsonData} />
          </Box>
        )}
      </VStack>
    )
  },
)
