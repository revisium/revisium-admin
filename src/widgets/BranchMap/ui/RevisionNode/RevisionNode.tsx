import { Badge, Box, Button, Flex, HoverCard, Portal, ScrollArea, Text, VStack } from '@chakra-ui/react'
import { Handle, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { useBranchMapContext } from '../../lib/BranchMapContext.ts'
import { RevisionNodeViewModel } from '../../model/view-model/RevisionNodeViewModel.ts'

interface RevisionNodeProps {
  data: {
    model: RevisionNodeViewModel
    onMouseEnter: (nodeId: string) => void
    onMouseLeave: () => void
    onClick: (nodeId: string) => void
    onNavigate: (revisionId: string, branchName: string, tag?: string) => void
  }
}

const getBadgeColor = (model: RevisionNodeViewModel): string => {
  if (model.isDraft) {
    return 'orange'
  }
  if (model.isHead) {
    return 'green'
  }
  if (model.isStart) {
    return 'blue'
  }
  return 'gray'
}

const RevisionNodeInner: FC<RevisionNodeProps> = observer(({ data }) => {
  const { model, onMouseEnter, onMouseLeave, onClick, onNavigate } = data
  const { containerRef } = useBranchMapContext()

  const isHighlighted = model.isHighlighted
  const isDimmed = model.isDimmed
  const badgeColor = getBadgeColor(model)

  const handleNavigate = () => {
    if (model.branchName) {
      onNavigate(model.id, model.branchName, model.tag)
    }
  }

  return (
    <HoverCard.Root openDelay={300} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Box
          px={2}
          py={1.5}
          bg={isHighlighted ? 'blue.50' : 'white'}
          border="2px solid"
          borderColor={isHighlighted ? 'blue.400' : isDimmed ? 'gray.200' : 'gray.300'}
          borderRadius="md"
          cursor="pointer"
          opacity={isDimmed ? 0.5 : 1}
          transition="all 0.15s"
          onMouseEnter={() => onMouseEnter(model.id)}
          onMouseLeave={onMouseLeave}
          onClick={() => onClick(model.id)}
          _hover={{ borderColor: 'blue.400', boxShadow: 'sm' }}
        >
          <Flex align="center" gap={1.5}>
            <Text fontSize="11px" fontWeight="600" fontFamily="mono" color="gray.600">
              {model.shortId}
            </Text>
            {model.badge && (
              <Badge size="xs" colorPalette={badgeColor}>
                {model.badge}
              </Badge>
            )}
          </Flex>

          <Handle id="left" type="target" position={Position.Left} style={{ background: '#718096' }} />
          {!model.isDraft && (
            <Handle id="right" type="source" position={Position.Right} style={{ background: '#718096' }} />
          )}
          {model.hasEndpoints && (
            <Handle id="top" type="target" position={Position.Top} style={{ background: '#718096' }} />
          )}
          {model.hasChildBranches && (
            <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#805AD5' }} />
          )}
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
                  <Flex justify="space-between" align="center" width="100%">
                    <Flex align="center" gap={2}>
                      <Text fontSize="xs" fontWeight="600" fontFamily="mono" color="gray.700">
                        {model.shortId}
                      </Text>
                      {model.badge && (
                        <Badge size="sm" colorPalette={badgeColor}>
                          {model.badge}
                        </Badge>
                      )}
                    </Flex>
                    <Button size="xs" variant="ghost" colorPalette="blue" onClick={handleNavigate}>
                      Open
                    </Button>
                  </Flex>

                  <Box width="100%">
                    <Text fontSize="10px" color="gray.400" mb={0.5}>
                      Full ID
                    </Text>
                    <Text fontSize="11px" fontFamily="mono" color="gray.600" wordBreak="break-all">
                      {model.id}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="10px" color="gray.400">
                      Created
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {new Date(model.createdAt).toLocaleString()}
                    </Text>
                  </Box>

                  {model.comment && (
                    <Box width="100%">
                      <Text fontSize="10px" color="gray.400" mb={0.5}>
                        Comment
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {model.comment}
                      </Text>
                    </Box>
                  )}

                  {model.hasEndpoints && (
                    <Box width="100%">
                      <Text fontSize="10px" color="gray.400" mb={0.5}>
                        Endpoints
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {model.endpointTypes.join(', ')}
                      </Text>
                    </Box>
                  )}

                  {model.childBranchIds.length > 0 && (
                    <Box width="100%">
                      <Text fontSize="10px" color="gray.400" mb={0.5}>
                        Child branches
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {model.childBranchIds.length} branch(es)
                      </Text>
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
  )
})

export const RevisionNode = memo(RevisionNodeInner)
