import { LoaderFunction } from 'react-router-dom'
import { getBranchVariables } from 'src/app/lib/utils.ts'
import { BranchDataSource } from 'src/entities/Branch'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const branchLoader: LoaderFunction = async ({ params }) => {
  const branchVariables = getBranchVariables(params)
  const branchDataSource = container.get(BranchDataSource)
  const context = container.get(ProjectContext)

  const branch = await branchDataSource.getBranch(
    branchVariables.organizationId,
    branchVariables.projectName,
    branchVariables.branchName,
  )

  context.setBranch(branch)

  return branch
}
