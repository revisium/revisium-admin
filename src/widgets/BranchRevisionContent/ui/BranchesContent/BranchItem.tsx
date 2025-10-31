import { Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

import { BranchTreeNode } from 'src/widgets/BranchRevisionContent/model/BranchTreeNode.ts'

interface BranchItemProps {
  branch: BranchTreeNode
  onSelect: (branchId: string) => void
}

export const BranchItem: FC<BranchItemProps> = ({ branch, onSelect }) => {
  const handleClick = () => {
    onSelect(branch.id)
  }

  const indentationPx = branch.depth * 16

  return (
    <Link to={branch.link} style={{ textDecoration: 'none', display: 'block' }} onClick={handleClick}>
      <Box
        width="100%"
        backgroundColor={branch.isActive ? 'newGray.100' : 'transparent'}
        _hover={{
          backgroundColor: 'newGray.100',
        }}
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <Flex alignItems="center" paddingY="1.5" paddingX="2" paddingLeft={`${8 + indentationPx}px`}>
          <Text
            fontSize="sm"
            fontWeight={branch.isActive ? 'semibold' : 'medium'}
            color={branch.isActive ? 'newGray.600' : 'inherit'}
          >
            {branch.name}
            {branch.touched && ' *'}
          </Text>
        </Flex>
      </Box>
    </Link>
  )
}
