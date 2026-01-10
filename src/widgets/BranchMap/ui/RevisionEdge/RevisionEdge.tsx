import { BaseEdge, getBezierPath, getSmoothStepPath, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { RevisionEdgeViewModel } from '../../model/view-model/RevisionEdgeViewModel.ts'

export interface RevisionEdgeData {
  model: RevisionEdgeViewModel
}

interface RevisionEdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition?: Position
  targetPosition?: Position
  data?: RevisionEdgeData
}

const RevisionEdgeInner: FC<RevisionEdgeProps> = observer(
  ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) => {
    const model = data?.model
    const isHighlighted = model?.isHighlighted ?? false
    const edgeType = model?.edgeType ?? 'revision'

    const isEndpoint = edgeType === 'endpoint-graphql' || edgeType === 'endpoint-rest'
    const isCurved = edgeType === 'parent-to-branch' || isEndpoint

    const [edgePath] = isCurved
      ? getBezierPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          curvature: 0.25,
        })
      : getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 8,
        })

    const getStrokeColor = (): string => {
      if (isHighlighted) {
        return '#3182CE'
      }

      switch (edgeType) {
        case 'branch':
        case 'parent-to-branch':
          return '#805AD5'
        case 'endpoint-graphql':
          return '#D53F8C'
        case 'endpoint-rest':
          return '#38A169'
        default:
          return '#A0AEC0'
      }
    }

    const strokeWidth = isHighlighted ? 2 : 1.5
    const strokeColor = getStrokeColor()

    const getStrokeDasharray = (): string | undefined => {
      if (edgeType === 'branch' || edgeType === 'parent-to-branch' || isEndpoint) {
        return '5,5'
      }
      return undefined
    }

    return (
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: getStrokeDasharray(),
          filter: isHighlighted ? 'drop-shadow(0 0 2px rgba(49, 130, 206, 0.5))' : 'none',
          transition: 'stroke 0.15s, stroke-width 0.15s, filter 0.15s',
        }}
      />
    )
  },
)

export const RevisionEdge = memo(RevisionEdgeInner)
