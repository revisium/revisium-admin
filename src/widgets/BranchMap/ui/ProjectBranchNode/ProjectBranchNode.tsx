import { Badge, Box, Button, Flex, HoverCard, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { Handle, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { PiGitBranchLight } from 'react-icons/pi'
import { useBranchMapContext } from '../../lib/BranchMapContext.ts'
import { ProjectBranchNodeViewModel } from '../../model/view-model/ProjectBranchNodeViewModel.ts'

interface ProjectBranchNodeProps {
  data: {
    model: ProjectBranchNodeViewModel
    onMouseEnter: (nodeId: string) => void
    onMouseLeave: () => void
    onClick: (nodeId: string) => void
    onNavigate: (branchName: string) => void
  }
}

const ProjectBranchNodeInner: FC<ProjectBranchNodeProps> = observer(({ data }) => {
  const { model, onMouseEnter, onMouseLeave, onClick, onNavigate } = data
  const { containerRef } = useBranchMapContext()

  const isHighlighted = model.isHighlighted
  const isDimmed = model.isDimmed

  const handleNavigate = () => {
    onNavigate(model.name)
  }

  return (
    <HoverCard.Root openDelay={300} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Box
          px={3}
          py={1.5}
          mt="-2px"
          bg={isHighlighted ? 'purple.50' : 'gray.50'}
          border="2px dashed"
          borderColor={isHighlighted ? 'purple.400' : isDimmed ? 'gray.200' : 'gray.400'}
          borderRadius="md"
          cursor="pointer"
          opacity={isDimmed ? 0.5 : 1}
          transition="all 0.15s"
          onMouseEnter={() => onMouseEnter(model.id)}
          onMouseLeave={onMouseLeave}
          onClick={() => onClick(model.id)}
          _hover={{ borderColor: 'purple.400', bg: 'purple.50' }}
          minWidth="80px"
        >
          <Flex align="center" gap={1.5}>
            <Icon as={PiGitBranchLight} color="purple.600" boxSize={4} />
            <Text fontSize="xs" fontWeight="600" color="purple.700" truncate maxWidth="100px">
              {model.name}
            </Text>
          </Flex>

          {!model.isRoot && <Handle id="top" type="target" position={Position.Top} style={{ background: '#805AD5' }} />}
          <Handle id="right" type="source" position={Position.Right} style={{ background: '#805AD5' }} />
        </Box>
      </HoverCard.Trigger>

      <Portal container={containerRef}>
        <HoverCard.Positioner>
          <HoverCard.Content maxWidth="280px" p={3}>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            <VStack align="start" gap={2}>
              <Flex justify="space-between" align="center" width="100%">
                <Flex align="center" gap={2}>
                  <Icon as={PiGitBranchLight} color="purple.600" boxSize={4} />
                  <Text fontSize="xs" fontWeight="600" color="purple.700">
                    {model.name}
                  </Text>
                  {model.isRoot && (
                    <Badge size="xs" colorPalette="blue">
                      root
                    </Badge>
                  )}
                </Flex>
                <Button size="xs" variant="ghost" colorPalette="purple" onClick={handleNavigate}>
                  Open
                </Button>
              </Flex>

              {model.parentBranchName && (
                <Box width="100%">
                  <Text fontSize="10px" color="gray.400" mb={0.5}>
                    Parent branch
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {model.parentBranchName}
                  </Text>
                </Box>
              )}

              {model.touched && (
                <Flex align="center" gap={1}>
                  <Badge size="xs" colorPalette="orange">
                    uncommitted
                  </Badge>
                  <Text fontSize="10px" color="orange.600">
                    Has pending changes
                  </Text>
                </Flex>
              )}

              <Box width="100%">
                <Text fontSize="10px" color="gray.400" mb={0.5}>
                  Created
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {new Date(model.createdAt).toLocaleString()}
                </Text>
              </Box>
            </VStack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
})

export const ProjectBranchNode = memo(ProjectBranchNodeInner)
