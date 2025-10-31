import { FC } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { RevisionTreeNode } from 'src/widgets/BranchRevisionContent/model/RevisionTreeNode.ts'
import { RevisionItem } from 'src/widgets/BranchRevisionContent/ui/RevisionsContent/RevisionItem.tsx'

interface RevisionsListProps {
  revisions: RevisionTreeNode[]
  onSelect: (revisionId: string) => void
}

export const RevisionsList: FC<RevisionsListProps> = ({ revisions, onSelect }) => {
  return (
    <Virtuoso
      style={{ height: '100%', width: '100%' }}
      totalCount={revisions.length}
      data={revisions}
      itemContent={(_, revision) => <RevisionItem key={revision.id} revision={revision} onSelect={onSelect} />}
    />
  )
}
