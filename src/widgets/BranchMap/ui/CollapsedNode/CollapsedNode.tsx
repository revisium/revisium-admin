import { Box, HoverCard, Portal, Text, VStack } from '@chakra-ui/react'
import { Handle, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { useBranchMapContext } from '../../lib/BranchMapContext.ts'
import { CollapsedNodeViewModel } from '../../model/view-model/CollapsedNodeViewModel.ts'

interface CollapsedNodeProps {
  data: {
    model: CollapsedNodeViewModel
    onMouseEnter: (nodeId: string) => void
    onMouseLeave: () => void
    onClick: (nodeId: string) => void
  }
}

const CollapsedNodeInner: FC<CollapsedNodeProps> = observer(({ data }) => {
  const { model, onMouseEnter, onMouseLeave, onClick } = data
  const { containerRef } = useBranchMapContext()

  const isHighlighted = model.isHighlighted
  const isDimmed = model.isDimmed

  return (
    <HoverCard.Root openDelay={300} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Box
          px={3}
          py={1.5}
          mt="-2px"
          bg={isHighlighted ? 'orange.50' : 'gray.100'}
          border="2px dashed"
          borderColor={isHighlighted ? 'orange.400' : isDimmed ? 'gray.200' : 'gray.300'}
          borderRadius="md"
          cursor="pointer"
          opacity={isDimmed ? 0.5 : 1}
          transition="all 0.15s"
          onMouseEnter={() => onMouseEnter(model.id)}
          onMouseLeave={onMouseLeave}
          onClick={() => onClick(model.id)}
          _hover={{ borderColor: 'orange.400', bg: 'orange.50' }}
          minWidth="60px"
          textAlign="center"
        >
          <Text fontSize="xs" fontWeight="600" color="gray.500">
            ...
          </Text>

          <Handle id="left" type="target" position={Position.Left} style={{ background: '#A0AEC0' }} />
          <Handle id="right" type="source" position={Position.Right} style={{ background: '#A0AEC0' }} />
        </Box>
      </HoverCard.Trigger>

      <Portal container={containerRef}>
        <HoverCard.Positioner>
          <HoverCard.Content maxWidth="250px" p={3}>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            <VStack align="start" gap={1}>
              <Text fontSize="xs" fontWeight="600" color="orange.600">
                Revisions between
              </Text>
              <Text fontSize="10px" color="gray.500">
                left and right nodes
              </Text>
            </VStack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
})

export const CollapsedNode = memo(CollapsedNodeInner)
