import { Box } from '@chakra-ui/react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ControlButton,
  NodeTypes,
  EdgeTypes,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { PiArrowsInSimple, PiArrowsOutSimple } from 'react-icons/pi'
import { TableRelationsContext } from '../../lib/TableRelationsContext.ts'
import { TableRelationsViewModel } from '../../model/TableRelationsViewModel.ts'
import { RelationEdge } from '../RelationEdge/RelationEdge.tsx'
import { TableNode } from '../TableNode/TableNode.tsx'

interface TableRelationsGraphProps {
  model: TableRelationsViewModel
}

const nodeTypes: NodeTypes = {
  tableNode: TableNode as NodeTypes['tableNode'],
}

const edgeTypes: EdgeTypes = {
  relationEdge: RelationEdge as EdgeTypes['relationEdge'],
}

const TableRelationsGraphInner: FC<TableRelationsGraphProps> = observer(({ model }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    model.fullscreen.setContainerRef(containerRef.current)
    return () => model.fullscreen.setContainerRef(null)
  }, [model])

  const handleInit = useCallback((instance: ReactFlowInstance) => model.setReactFlowInstance(instance), [model])

  useEffect(() => {
    return () => model.setReactFlowInstance(null)
  }, [model])

  const contextValue = useMemo(() => ({ containerRef }), [])

  return (
    <TableRelationsContext.Provider value={contextValue}>
      <Box
        ref={containerRef}
        width="100%"
        height={model.fullscreen.isFullscreen ? '100vh' : 'calc(100vh - 200px)'}
        border="1px solid"
        borderColor="gray.200"
        borderRadius={model.fullscreen.isFullscreen ? 'none' : 'md'}
        bg="white"
      >
        <ReactFlow
          defaultNodes={model.reactFlowNodes}
          defaultEdges={model.reactFlowEdges}
          onInit={handleInit}
          onPaneClick={model.clearSelection}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
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
    </TableRelationsContext.Provider>
  )
})

export const TableRelationsGraph: FC<TableRelationsGraphProps> = observer(({ model }) => {
  return (
    <ReactFlowProvider>
      <TableRelationsGraphInner model={model} />
    </ReactFlowProvider>
  )
})
