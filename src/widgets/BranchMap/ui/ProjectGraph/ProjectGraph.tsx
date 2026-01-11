import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { Background, BackgroundVariant, ControlButton, Controls, NodeChange, ReactFlow } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { PiArrowsInSimple, PiArrowsOutSimple } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useViewModel } from 'src/shared/lib'
import { BranchMapContext } from '../../lib/BranchMapContext.ts'
import { ProjectGraphViewModel } from '../../model/view-model/ProjectGraphViewModel.ts'
import { CollapsedNode } from '../CollapsedNode/CollapsedNode.tsx'
import { EndpointNode } from '../EndpointNode/EndpointNode.tsx'
import { ProjectBranchNode } from '../ProjectBranchNode/ProjectBranchNode.tsx'
import { ProjectGraphHeader } from '../ProjectGraphHeader/ProjectGraphHeader.tsx'
import { RevisionEdge } from '../RevisionEdge/RevisionEdge.tsx'
import { RevisionNode } from '../RevisionNode/RevisionNode.tsx'

const nodeTypes = {
  branchNode: ProjectBranchNode,
  revisionNode: RevisionNode,
  collapsedNode: CollapsedNode,
  endpointNode: EndpointNode,
}

const edgeTypes = {
  revisionEdge: RevisionEdge,
}

export const ProjectGraph: FC = observer(() => {
  const navigate = useNavigate()
  const model = useViewModel(ProjectGraphViewModel, navigate)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (model.showGraph) {
      model.fullscreen.setContainerRef(containerRef.current)
    }
    return () => model.fullscreen.setContainerRef(null)
  }, [model, model.showGraph])

  const contextValue = useMemo(() => ({ containerRef }), [])

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      model.handleNodesChange(changes)
    },
    [model],
  )

  const handlePaneClick = useCallback(() => {
    model.clearSelection()
  }, [model])

  if (model.isLoading) {
    return (
      <Box>
        <ProjectGraphHeader projectName={model.projectName} branchesCount={0} endpointsCount={0} />
        <Flex align="center" justify="center" height="400px">
          <Spinner size="lg" color="blue.500" />
        </Flex>
      </Box>
    )
  }

  if (model.isError) {
    return (
      <Box>
        <ProjectGraphHeader projectName={model.projectName} branchesCount={0} endpointsCount={0} />
        <Flex align="center" justify="center" height="400px">
          <Text color="red.500">Failed to load project graph</Text>
        </Flex>
      </Box>
    )
  }

  if (model.isEmpty) {
    return (
      <Box>
        <ProjectGraphHeader projectName={model.projectName} branchesCount={0} endpointsCount={0} />
        <Flex align="center" justify="center" height="400px">
          <Text color="gray.500">No branches found</Text>
        </Flex>
      </Box>
    )
  }

  return (
    <BranchMapContext.Provider value={contextValue}>
      <Box>
        {!model.fullscreen.isFullscreen && (
          <ProjectGraphHeader
            projectName={model.projectName}
            branchesCount={model.branchesCount}
            endpointsCount={model.endpointsCount}
          />
        )}
        <Box
          ref={containerRef}
          position="relative"
          width="100%"
          height={model.fullscreen.isFullscreen ? '100vh' : '600px'}
          bg="white"
          borderRadius={model.fullscreen.isFullscreen ? 'none' : 'lg'}
        >
          <ReactFlow
            nodes={model.reactFlowNodes}
            edges={model.reactFlowEdges}
            onNodesChange={handleNodesChange}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E2E8F0" />
            <Controls showInteractive={false}>
              <ControlButton
                onClick={model.fullscreen.toggleFullscreen}
                title={model.fullscreen.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {model.fullscreen.isFullscreen ? <PiArrowsInSimple /> : <PiArrowsOutSimple />}
              </ControlButton>
            </Controls>
          </ReactFlow>
        </Box>
      </Box>
    </BranchMapContext.Provider>
  )
})
