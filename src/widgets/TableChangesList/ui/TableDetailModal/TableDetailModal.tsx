import { Box, Button, Flex, Text, Portal, Link } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PiArrowRight, PiX } from 'react-icons/pi'
import { ChangeType } from 'src/__generated__/graphql-request'
import { TableDetailModalModel } from '../../model/TableDetailModalModel'

const getViewChangeTypeColor = (changeType: ChangeType): string => {
  switch (changeType) {
    case ChangeType.Added:
      return 'green.500'
    case ChangeType.Modified:
      return 'orange.500'
    case ChangeType.Removed:
      return 'red.500'
    case ChangeType.Renamed:
    case ChangeType.RenamedAndModified:
      return 'blue.500'
    default:
      return 'gray.500'
  }
}

interface TableDetailModalProps {
  model: TableDetailModalModel
}

export const TableDetailModal: React.FC<TableDetailModalProps> = observer(({ model }) => {
  const navigate = useNavigate()

  const handleViewRowChanges = useCallback(() => {
    navigate(model.rowChangesLink)
    model.close()
  }, [model, navigate])

  if (!model.item) {
    return null
  }

  return (
    <Portal>
      <Dialog.Root open={model.isOpen} onOpenChange={(e) => !e.open && model.close()} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center" gap="0.5rem">
                  <Text fontSize="18px" fontWeight="600">
                    <Link asChild colorPalette="gray" focusRing="none">
                      <RouterLink to={model.tableLink}>{model.displayName}</RouterLink>
                    </Link>
                  </Text>
                  <Text fontSize="14px" fontWeight="500" color={model.changeTypeBadgeColor}>
                    {model.changeTypeLabel}
                  </Text>
                </Flex>
                <Dialog.CloseTrigger asChild>
                  <Box cursor="pointer" color="gray.400" _hover={{ color: 'gray.600' }}>
                    <PiX size={20} />
                  </Box>
                </Dialog.CloseTrigger>
              </Flex>
            </Dialog.Header>

            <Dialog.Body>
              {model.isRenamed && model.oldTableId && (
                <Box mb="1rem" paddingY="0.5rem" paddingX="0.75rem" backgroundColor="blue.50" borderRadius="4px">
                  <Text fontSize="12px" color="gray.600">
                    Renamed from: {model.oldTableId}
                  </Text>
                </Box>
              )}

              {model.hasRowChanges && (
                <Box mb="1rem">
                  <Text fontSize="14px" fontWeight="500" color="newGray.500" mb="0.5rem">
                    Row Changes ({model.rowChangesCount})
                  </Text>
                  <Flex gap="1rem" fontSize="13px" color="gray.500" flexWrap="wrap">
                    {model.addedRowsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="green.500" />
                        <Text>Added: {model.addedRowsCount}</Text>
                      </Flex>
                    )}
                    {model.modifiedRowsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="orange.500" />
                        <Text>Modified: {model.modifiedRowsCount}</Text>
                      </Flex>
                    )}
                    {model.removedRowsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="red.500" />
                        <Text>Removed: {model.removedRowsCount}</Text>
                      </Flex>
                    )}
                    {model.renamedRowsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="blue.500" />
                        <Text>Renamed: {model.renamedRowsCount}</Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              )}

              {model.hasSchemaChanges && (
                <Box mb="1rem">
                  <Text fontSize="14px" fontWeight="500" color="newGray.500" mb="0.5rem">
                    Schema Migrations ({model.schemaMigrationsCount})
                  </Text>
                  {model.schemaMigrations.map((migration, index) => (
                    <Box
                      key={index}
                      mb="0.5rem"
                      paddingY="0.5rem"
                      paddingX="0.75rem"
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="4px"
                    >
                      <Text fontSize="12px" fontWeight="500" color="purple.500" mb="0.25rem">
                        {migration.migrationType}
                      </Text>
                      {migration.patches && migration.patches.length > 0 && (
                        <Box fontSize="11px" fontFamily="monospace" color="gray.600">
                          {migration.patches.map((patch, patchIndex) => (
                            <Text key={patchIndex}>
                              {patch.op}: {patch.path}
                            </Text>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {model.hasViewsChanges && (
                <Box mb="1rem">
                  <Text fontSize="14px" fontWeight="500" color="newGray.500" mb="0.5rem">
                    Views Changes ({model.viewsChangesCount})
                  </Text>
                  <Flex gap="1rem" fontSize="13px" color="gray.500" flexWrap="wrap" mb="0.5rem">
                    {model.addedViewsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="green.500" />
                        <Text>Added: {model.addedViewsCount}</Text>
                      </Flex>
                    )}
                    {model.modifiedViewsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="orange.500" />
                        <Text>Modified: {model.modifiedViewsCount}</Text>
                      </Flex>
                    )}
                    {model.removedViewsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="red.500" />
                        <Text>Removed: {model.removedViewsCount}</Text>
                      </Flex>
                    )}
                    {model.renamedViewsCount > 0 && (
                      <Flex alignItems="center" gap="0.25rem">
                        <Box width="8px" height="8px" borderRadius="50%" backgroundColor="blue.500" />
                        <Text>Renamed: {model.renamedViewsCount}</Text>
                      </Flex>
                    )}
                  </Flex>
                  {model.viewsChanges.map((viewChange, index) => (
                    <Box
                      key={index}
                      mb="0.5rem"
                      paddingY="0.5rem"
                      paddingX="0.75rem"
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="4px"
                    >
                      <Flex alignItems="center" gap="0.5rem">
                        <Text fontSize="12px" fontWeight="500" color="gray.700">
                          {viewChange.viewName}
                        </Text>
                        <Text fontSize="11px" color={getViewChangeTypeColor(viewChange.changeType)}>
                          {viewChange.changeType.toLowerCase().replaceAll('_', ' ')}
                        </Text>
                      </Flex>
                      {viewChange.oldViewName && (
                        <Text fontSize="11px" color="gray.500">
                          Renamed from: {viewChange.oldViewName}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {model.hasRowChanges && (
                <Box mt="1.5rem">
                  <Button variant="ghost" size="sm" colorPalette="gray" focusRing="none" onClick={handleViewRowChanges}>
                    View all row changes
                    <PiArrowRight />
                  </Button>
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  )
})
