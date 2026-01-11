import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { RelationEdgeViewModel } from '../../model/RelationEdgeViewModel.ts'

export interface RelationEdgeData {
  model: RelationEdgeViewModel
}

interface RelationEdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  data?: RelationEdgeData
}

const RelationEdgeInner: FC<RelationEdgeProps> = observer(
  ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) => {
    const model = data?.model
    const curveOffset = model?.curveOffset ?? 0

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY: sourceY + curveOffset,
      sourcePosition,
      targetX,
      targetY: targetY + curveOffset,
      targetPosition,
    })

    const isHighlighted = model?.isHighlighted ?? false
    const fieldPath = model?.fieldPath ?? ''

    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: isHighlighted ? '#475569' : '#cbd5e1',
            strokeWidth: isHighlighted ? 2 : 1,
            strokeDasharray: isHighlighted ? '6 3' : 'none',
            animation: isHighlighted ? 'dash-flow 0.5s linear infinite' : 'none',
            filter: isHighlighted ? 'drop-shadow(0 0 2px rgba(71, 85, 105, 0.5))' : 'none',
            transition: 'stroke 0.15s, stroke-width 0.15s, filter 0.15s',
          }}
        />

        {isHighlighted && fieldPath && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                pointerEvents: 'none',
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#475569',
                backgroundColor: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #94a3b8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {fieldPath}
            </div>
          </EdgeLabelRenderer>
        )}

        <style>
          {`
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -9;
            }
          }
        `}
        </style>
      </>
    )
  },
)

export const RelationEdge = memo(RelationEdgeInner)
