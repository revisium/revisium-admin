import { Flex, IconButton } from '@chakra-ui/react'
import React from 'react'
import { PiArrowsInLineVertical, PiArrowsOutLineVertical } from 'react-icons/pi'

interface TreeCollapseButtonsProps {
  onExpandAll: () => void
  onCollapseAll: () => void
}

export const TreeCollapseButtons: React.FC<TreeCollapseButtonsProps> = ({ onExpandAll, onCollapseAll }) => {
  return (
    <Flex gap="4px">
      <IconButton
        aria-label="Expand all"
        data-testid="tree-expand-all-button"
        _hover={{ backgroundColor: 'gray.50' }}
        color="gray.400"
        height="2.5rem"
        variant="ghost"
        onClick={onExpandAll}
        width="48px"
        size="sm"
      >
        <PiArrowsOutLineVertical />
      </IconButton>
      <IconButton
        aria-label="Collapse all"
        data-testid="tree-collapse-all-button"
        _hover={{ backgroundColor: 'gray.50' }}
        color="gray.400"
        height="2.5rem"
        variant="ghost"
        onClick={onCollapseAll}
        width="48px"
        size="sm"
      >
        <PiArrowsInLineVertical />
      </IconButton>
    </Flex>
  )
}
