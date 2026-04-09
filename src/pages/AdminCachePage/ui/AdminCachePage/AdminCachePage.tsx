import { Box, Button, Flex, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useViewModel } from 'src/shared/lib'
import { AdminCacheViewModel } from '../../model/AdminCacheViewModel'

interface StatCardProps {
  label: string
  value: string | number
  isLoading: boolean
}

const StatCard: FC<StatCardProps> = ({ label, value, isLoading }) => {
  return (
    <Box
      padding="24px"
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.200"
      backgroundColor="white"
      minWidth="160px"
    >
      <Text fontSize="sm" color="gray.500" marginBottom="8px">
        {label}
      </Text>
      {isLoading ? (
        <Spinner size="sm" color="gray.400" />
      ) : (
        <Text fontSize="2xl" fontWeight="600" color="gray.900">
          {value}
        </Text>
      )}
    </Box>
  )
}

interface KeyMetricRowProps {
  keyName: string
  hits: number
  misses: number
  writes: number
  deletes: number
  hitRate: number
}

const KeyMetricRow: FC<KeyMetricRowProps> = ({ keyName, hits, misses, writes, deletes, hitRate }) => {
  return (
    <Flex
      padding="12px 16px"
      borderBottom="1px solid"
      borderColor="gray.100"
      alignItems="center"
      gap="16px"
      _last={{ borderBottom: 'none' }}
    >
      <Text flex="1" fontSize="sm" fontWeight="500" fontFamily="mono">
        {keyName}
      </Text>
      <Text fontSize="sm" color="gray.600" minWidth="80px" textAlign="right">
        {hits} hits
      </Text>
      <Text fontSize="sm" color="gray.600" minWidth="80px" textAlign="right">
        {misses} miss
      </Text>
      <Text fontSize="sm" color="gray.600" minWidth="80px" textAlign="right">
        {writes} writes
      </Text>
      <Text fontSize="sm" color="gray.600" minWidth="80px" textAlign="right">
        {deletes} del
      </Text>
      <Text fontSize="sm" fontWeight="500" minWidth="60px" textAlign="right">
        {(hitRate * 100).toFixed(1)}%
      </Text>
    </Flex>
  )
}

export const AdminCachePage: FC = observer(() => {
  const model = useViewModel(AdminCacheViewModel)

  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        alignItems="center"
        backgroundColor="white"
        justifyContent="space-between"
        width="100%"
        position="sticky"
        zIndex={1}
        top={0}
        padding="8px"
      >
        <Flex alignItems="center" gap="4px" height="40px">
          <Breadcrumb.Root color="gray" fontWeight="600" fontSize="16px">
            <Breadcrumb.List fontSize="16px">
              <Breadcrumb.Item>
                <Breadcrumb.CurrentLink color="gray">Cache</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Flex>
      </Flex>

      {!model.cacheEnabled ? (
        <Box padding="8px" paddingTop="16px">
          <Box padding="24px" borderRadius="8px" border="1px solid" borderColor="gray.200" backgroundColor="white">
            <Text fontSize="md" fontWeight="500" color="gray.500">
              Caching is disabled
            </Text>
            <Text fontSize="sm" color="gray.400" marginTop="4px">
              Set CACHE_ENABLED=1 to enable caching.
            </Text>
          </Box>
        </Box>
      ) : (
        <Box padding="8px" paddingTop="16px">
          <Flex gap="16px" flexWrap="wrap" marginBottom="24px">
            <StatCard
              label="Hit Rate"
              value={`${(model.overallHitRate * 100).toFixed(1)}%`}
              isLoading={model.isLoading}
            />
            <StatCard label="Hits" value={model.totalHits} isLoading={model.isLoading} />
            <StatCard label="Misses" value={model.totalMisses} isLoading={model.isLoading} />
            <StatCard label="Writes" value={model.totalWrites} isLoading={model.isLoading} />
            <StatCard label="Deletes" value={model.totalDeletes} isLoading={model.isLoading} />
            <StatCard label="Clears" value={model.totalClears} isLoading={model.isLoading} />
          </Flex>

          {model.byCategory.length > 0 && (
            <Box marginBottom="24px">
              <Text fontSize="sm" fontWeight="600" color="gray.700" marginBottom="8px">
                By Cache Type
              </Text>
              <Box border="1px solid" borderColor="gray.200" borderRadius="8px" backgroundColor="white">
                {model.byCategory.map((metric) => (
                  <KeyMetricRow
                    key={metric.key}
                    keyName={metric.key}
                    hits={metric.hits}
                    misses={metric.misses}
                    writes={metric.writes}
                    deletes={metric.deletes}
                    hitRate={metric.hitRate}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <Button
              colorPalette="red"
              variant="outline"
              size="sm"
              onClick={model.openConfirm}
              loading={model.isResetting}
            >
              Reset All Cache
            </Button>

            {model.resetSuccess && (
              <Text fontSize="sm" color="green.500" marginTop="8px">
                Cache has been cleared successfully
              </Text>
            )}

            {model.resetError && (
              <Text fontSize="sm" color="red.500" marginTop="8px">
                {model.resetError}
              </Text>
            )}
          </Box>
        </Box>
      )}

      <DialogRoot open={model.showConfirm} onOpenChange={({ open }) => !open && model.closeConfirm()} size="md">
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset All Cache</DialogTitle>
              </DialogHeader>

              <DialogBody>
                <VStack align="stretch" gap="1rem">
                  <Text>Are you sure you want to clear the entire cache?</Text>
                  <Text fontSize="sm" color="gray.600">
                    This will flush all cached data including rows, revisions, auth, and billing caches. The cache will
                    be rebuilt automatically as data is accessed.
                  </Text>
                </VStack>
              </DialogBody>

              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button colorPalette="red" onClick={model.confirmReset}>
                  Reset Cache
                </Button>
              </DialogFooter>

              <DialogCloseTrigger />
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </Flex>
  )
})
