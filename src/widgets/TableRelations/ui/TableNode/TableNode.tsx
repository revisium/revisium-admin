import { Box, Flex, HoverCard, Portal, ScrollArea, Text, VStack } from '@chakra-ui/react'
import { Handle, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { useTableRelationsContext } from '../../lib/TableRelationsContext.ts'
import { TableNodeViewModel } from '../../model/TableNodeViewModel.ts'

export interface TableNodeData {
  model: TableNodeViewModel
  onMouseEnter: (nodeId: string) => void
  onMouseLeave: () => void
  onClick: (nodeId: string) => void
}

interface TableNodeProps {
  data: TableNodeData
}

const TableNodeInner: FC<TableNodeProps> = observer(({ data }) => {
  const { model, onMouseEnter, onMouseLeave, onClick } = data
  const { containerRef } = useTableRelationsContext()

  const isHighlighted = model.isHighlighted
  const isDimmed = model.isDimmed

  const handleMouseEnter = () => {
    onMouseEnter(model.id)
  }

  const handleClick = () => {
    onClick(model.id)
  }

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ background: '#94a3b8' }} />

      <HoverCard.Root openDelay={300} closeDelay={100}>
        <HoverCard.Trigger asChild>
          <Box
            px={4}
            py={3}
            bg={model.isSelected ? 'gray.100' : 'white'}
            border="1px solid"
            borderColor={isHighlighted ? 'gray.500' : 'gray.300'}
            borderRadius="md"
            cursor="pointer"
            opacity={isDimmed ? 0.4 : 1}
            transition="all 0.15s"
            _hover={{ borderColor: 'gray.500', boxShadow: 'sm' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
            minWidth="140px"
          >
            <Text fontSize="13px" fontWeight="600" color="gray.700" mb={1} textAlign="center">
              {model.id}
            </Text>
            <Flex justify="center" gap={3}>
              <Text fontSize="11px" color="gray.500">
                {model.fieldsCount} fields
              </Text>
              <Text fontSize="11px" color="gray.500">
                {model.rowsCount} rows
              </Text>
            </Flex>
          </Box>
        </HoverCard.Trigger>

        <Portal container={containerRef}>
          <HoverCard.Positioner>
            <HoverCard.Content maxWidth="320px" maxHeight="300px" p={0} bg="white" boxShadow="md">
              <HoverCard.Arrow>
                <HoverCard.ArrowTip />
              </HoverCard.Arrow>
              <ScrollArea.Root maxHeight="300px" width="100%">
                <ScrollArea.Viewport>
                  <VStack align="start" gap={2} p={3} pr={4}>
                    <Text fontSize="13px" fontWeight="600" color="gray.700">
                      {model.id}
                    </Text>

                    <Flex gap={4}>
                      <VStack align="start" gap={0}>
                        <Text fontSize="11px" color="gray.400">
                          Fields
                        </Text>
                        <Text fontSize="13px" color="gray.600">
                          {model.fieldsCount}
                        </Text>
                      </VStack>
                      <VStack align="start" gap={0}>
                        <Text fontSize="11px" color="gray.400">
                          Rows
                        </Text>
                        <Text fontSize="13px" color="gray.600">
                          {model.rowsCount}
                        </Text>
                      </VStack>
                    </Flex>

                    {model.outgoingEdges.length > 0 && (
                      <Box width="100%" overflow="hidden">
                        <Text fontSize="11px" color="gray.400" mb={1}>
                          References ({model.outgoingCount})
                        </Text>
                        {model.outgoingEdges.map((edge) => (
                          <Flex key={edge.id} fontSize="12px" color="gray.600" gap={1} flexWrap="wrap">
                            <Text fontFamily="mono" color="gray.500" wordBreak="break-all">
                              {edge.fieldPath}
                            </Text>
                            <Text color="gray.400">&rarr;</Text>
                            <Text fontWeight="500">{edge.targetTableId}</Text>
                          </Flex>
                        ))}
                      </Box>
                    )}

                    {model.incomingEdges.length > 0 && (
                      <Box width="100%" overflow="hidden">
                        <Text fontSize="11px" color="gray.400" mb={1}>
                          Referenced by ({model.incomingCount})
                        </Text>
                        {model.incomingEdges.map((edge) => (
                          <Flex key={edge.id} fontSize="12px" color="gray.600" gap={1} flexWrap="wrap">
                            <Text fontWeight="500">{edge.sourceTableId}</Text>
                            <Text fontFamily="mono" color="gray.500" wordBreak="break-all">
                              .{edge.fieldPath}
                            </Text>
                          </Flex>
                        ))}
                      </Box>
                    )}
                  </VStack>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical">
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>

      <Handle type="source" position={Position.Right} style={{ background: '#94a3b8' }} />
    </>
  )
})

export const TableNode = memo(TableNodeInner)
