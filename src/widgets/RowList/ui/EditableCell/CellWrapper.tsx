import { Box, Spinner, Text } from '@chakra-ui/react'
import { Tooltip } from 'src/shared/ui'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren, useCallback, useRef } from 'react'
import { CellPosition, getClickOffset, getCellPosition } from '../../lib/getClickOffset'
import { CellState } from '../../model/CellViewModel'

export type { CellState, CellPosition }

interface CellWrapperProps extends PropsWithChildren {
  state: CellState
  displayValue?: string
  tooltip?: string
  onFocus?: () => void
  onDoubleClick?: (clickOffset?: number, position?: CellPosition) => void
}

const stateStyles: Record<CellState, object> = {
  display: {
    cursor: 'cell',
    _hover: {
      bg: 'gray.50',
    },
  },
  focused: {
    cursor: 'cell',
    outline: '2px solid',
    outlineColor: 'blue.400',
    outlineOffset: '-2px',
    bg: 'blue.50',
  },
  editing: {
    cursor: 'text',
    outline: '2px solid',
    outlineColor: 'blue.500',
    outlineOffset: '-2px',
    bg: 'white',
    zIndex: 1000,
  },
  saving: {
    cursor: 'wait',
    opacity: 0.7,
    bg: 'gray.50',
  },
  error: {
    cursor: 'cell',
    outline: '2px solid',
    outlineColor: 'red.400',
    outlineOffset: '-2px',
    bg: 'red.50',
  },
  readonly: {
    cursor: 'default',
    color: 'gray.500',
  },
}

export const CellWrapper: FC<CellWrapperProps> = observer(
  ({ children, state, displayValue, tooltip, onFocus, onDoubleClick }) => {
    const cellRef = useRef<HTMLTableCellElement>(null)
    const textRef = useRef<HTMLParagraphElement>(null)

    const handleClick = useCallback(() => {
      if (state !== 'editing' && state !== 'saving') {
        onFocus?.()
      }
    }, [state, onFocus])

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (e.detail === 2 && state !== 'saving' && state !== 'readonly') {
          e.preventDefault()
        }
      },
      [state],
    )

    const handleDoubleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()

        if (state !== 'saving' && state !== 'readonly') {
          const clickOffset = getClickOffset(textRef.current, displayValue, e.clientX)
          const cellPosition = getCellPosition(cellRef.current)
          onDoubleClick?.(clickOffset, cellPosition)
        }
      },
      [state, onDoubleClick, displayValue],
    )

    const content = (
      <Box
        ref={cellRef}
        as="td"
        minHeight="40px"
        height="40px"
        borderRightWidth="1px"
        borderColor="gray.100"
        overflow="hidden"
        maxWidth="0"
        pl="8px"
        pr="8px"
        position="relative"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        tabIndex={state === 'focused' || state === 'editing' ? 0 : -1}
        {...stateStyles[state]}
      >
        <Box display="flex" alignItems="center" height="100%" width="100%" minWidth={0}>
          {state === 'editing' ? (
            children
          ) : (
            <Tooltip content={tooltip} disabled={!tooltip}>
              <Text
                ref={textRef}
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                color={state === 'readonly' ? 'gray.500' : 'black'}
                fontWeight="300"
                flex={1}
                minWidth={0}
              >
                {children}
              </Text>
            </Tooltip>
          )}
          {state === 'saving' && (
            <Box position="absolute" right="8px" top="50%" transform="translateY(-50%)">
              <Spinner size="xs" color="blue.500" />
            </Box>
          )}
        </Box>
      </Box>
    )

    return content
  },
)
