import { Box, Flex, Text, Portal, Link } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { PiX } from 'react-icons/pi'
import { RowDetailModalModel } from '../../model/RowDetailModalModel'
import { getFieldChangeTypeColor, formatValue } from '../../lib'
import { DiffView } from '../DiffView'

interface RowDetailModalProps {
  model: RowDetailModalModel
}

export const RowDetailModal: React.FC<RowDetailModalProps> = observer(({ model }) => {
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
                <Text fontSize="18px" fontWeight="600">
                  <Link asChild colorPalette="gray" focusRing="none">
                    <RouterLink to={model.tableLink}>{model.tableId}</RouterLink>
                  </Link>
                  {' / '}
                  <Link asChild colorPalette="gray" focusRing="none">
                    <RouterLink to={model.rowLink}>{model.displayName}</RouterLink>
                  </Link>
                  {model.isRenamed && model.oldRowId && (
                    <Text as="span" fontSize="14px" fontWeight="400" color="gray.400">
                      {' '}
                      ({model.oldRowId})
                    </Text>
                  )}
                </Text>
                <Dialog.CloseTrigger asChild>
                  <Box cursor="pointer" color="gray.400" _hover={{ color: 'gray.600' }}>
                    <PiX size={20} />
                  </Box>
                </Dialog.CloseTrigger>
              </Flex>
            </Dialog.Header>

            <Dialog.Body>
              <Box mb="1rem">
                <Flex gap="1rem" fontSize="14px" color="gray.500">
                  <Text>
                    Type:{' '}
                    <Text as="span" color="newGray.600" fontWeight="500">
                      {model.changeType}
                    </Text>
                  </Text>
                </Flex>
              </Box>

              {model.hasFieldChanges && (
                <Box>
                  <Text fontSize="14px" fontWeight="500" color="newGray.500" mb="0.5rem">
                    Field Changes ({model.fieldChangesCount})
                  </Text>
                  {model.fieldChanges.map((fieldChange, index) => (
                    <Box
                      key={index}
                      mb="0.75rem"
                      paddingY="0.5rem"
                      paddingX="0.75rem"
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="4px"
                    >
                      <Flex alignItems="center" gap="0.5rem" mb="0.25rem">
                        <Text fontSize="12px" fontWeight="500" color={getFieldChangeTypeColor(fieldChange.changeType)}>
                          {fieldChange.changeType}
                        </Text>
                        <Text fontSize="12px" fontFamily="monospace" color="gray.600">
                          {fieldChange.fieldPath}
                        </Text>
                      </Flex>

                      {fieldChange.changeType === 'FIELD_MOVED' && fieldChange.movedFrom && (
                        <Text fontSize="12px" color="gray.500" mb="0.25rem">
                          Moved from: {fieldChange.movedFrom}
                        </Text>
                      )}

                      {fieldChange.changeType === 'FIELD_MODIFIED' && (
                        <DiffView oldValue={fieldChange.oldValue} newValue={fieldChange.newValue} />
                      )}

                      {fieldChange.changeType === 'FIELD_ADDED' && (
                        <Box fontSize="12px">
                          <Text color="green.600" fontWeight="500" mb="0.25rem">
                            Added:
                          </Text>
                          <Box
                            backgroundColor="green.50"
                            padding="0.5rem"
                            borderRadius="4px"
                            fontFamily="monospace"
                            whiteSpace="pre-wrap"
                            wordBreak="break-word"
                          >
                            {formatValue(fieldChange.newValue)}
                          </Box>
                        </Box>
                      )}

                      {fieldChange.changeType === 'FIELD_REMOVED' && (
                        <Box fontSize="12px">
                          <Text color="red.600" fontWeight="500" mb="0.25rem">
                            Removed:
                          </Text>
                          <Box
                            backgroundColor="red.50"
                            padding="0.5rem"
                            borderRadius="4px"
                            fontFamily="monospace"
                            whiteSpace="pre-wrap"
                            wordBreak="break-word"
                          >
                            {formatValue(fieldChange.oldValue)}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  )
})
