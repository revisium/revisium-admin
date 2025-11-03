import { FC } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { BranchTreeNode } from 'src/widgets/BranchRevisionContent/model/BranchTreeNode.ts'
import { BranchItem } from 'src/widgets/BranchRevisionContent/ui/BranchesContent/BranchItem.tsx'

interface BranchesListProps {
  branches: BranchTreeNode[]
}

export const BranchesList: FC<BranchesListProps> = ({ branches }) => {
  return (
    <Virtuoso
      style={{ height: '100%', width: '100%' }}
      totalCount={branches.length}
      data={branches}
      itemContent={(_, branch) => <BranchItem key={branch.id} branch={branch} />}
    />
  )
}
