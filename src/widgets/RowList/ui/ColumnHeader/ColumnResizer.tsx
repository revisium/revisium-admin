import { Box } from '@chakra-ui/react'
import { FC } from 'react'

interface ColumnResizerProps {
  isResizing: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export const ColumnResizer: FC<ColumnResizerProps> = ({ isResizing, onMouseDown }) => {
  return (
    <Box
      role="group"
      position="absolute"
      right="-4px"
      top={0}
      bottom={0}
      width="8px"
      cursor="col-resize"
      zIndex={10}
      onMouseDown={onMouseDown}
    >
      <Box
        position="absolute"
        left="3px"
        top={0}
        bottom={0}
        width="2px"
        bg={isResizing ? 'blue.500' : 'transparent'}
        _groupHover={{ bg: 'blue.500' }}
        transition="background 0.1s"
        pointerEvents="none"
      />
    </Box>
  )
}
