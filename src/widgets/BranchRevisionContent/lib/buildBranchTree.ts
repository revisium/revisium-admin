import { FindBranchFragment } from 'src/__generated__/graphql-request.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { BranchTreeNode } from 'src/widgets/BranchRevisionContent/model/BranchTreeNode.ts'

export function buildBranchTree(branches: FindBranchFragment[], projectPageModel: ProjectPageModel): BranchTreeNode[] {
  const rootBranch = branches.find((branch) => branch.isRoot)
  if (!rootBranch) {
    return branches.map((branch) => new BranchTreeNode(branch, 0, projectPageModel))
  }

  const visited = new Set<string>()
  const result: BranchTreeNode[] = []

  const processBranch = (branchId: string, depth: number, parentPath: boolean[] = []) => {
    if (visited.has(branchId)) return
    visited.add(branchId)

    const branch = branches.find((b) => b.id === branchId)
    if (!branch) return

    const children = branches.filter((b) => b.parent?.revision?.branch?.id === branchId && !visited.has(b.id))

    children.sort((a, b) => a.name.localeCompare(b.name))

    const treeNode = new BranchTreeNode(branch, depth, projectPageModel)
    result.push(treeNode)

    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1
      processBranch(child.id, depth + 1, [...parentPath, !isLastChild])
    })
  }

  processBranch(rootBranch.id, 0)

  branches.forEach((branch) => {
    if (!visited.has(branch.id)) {
      const treeNode = new BranchTreeNode(branch, 0, projectPageModel)
      result.push(treeNode)
    }
  })

  return result
}
