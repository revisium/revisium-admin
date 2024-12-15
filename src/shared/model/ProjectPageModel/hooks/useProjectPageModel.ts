import { useEffect, useState } from 'react'
import { useParams, useRevalidator } from 'react-router-dom'
import { useCurrentRow } from 'src/shared/model/ProjectPageModel/hooks/row/useCurrentRow.ts'
import { useCurrentBranch } from 'src/shared/model/ProjectPageModel/hooks/useCurrentBranch.ts'
import { useCurrentOrganizationOrThrow } from 'src/shared/model/ProjectPageModel/hooks/useCurrentOrganizationOrThrow.ts'
import { useCurrentProjectOrThrow } from 'src/shared/model/ProjectPageModel/hooks/useCurrentProjectOrThrow.ts'
import { useCurrentRevision } from 'src/shared/model/ProjectPageModel/hooks/revision/useCurrentRevision.ts'
import { useCurrentTable } from 'src/shared/model/ProjectPageModel/hooks/table/useCurrentTable.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const useProjectPageModel = () => {
  const revalidator = useRevalidator()
  const params = useParams()
  const organization = useCurrentOrganizationOrThrow()
  const project = useCurrentProjectOrThrow()
  const branch = useCurrentBranch()
  const revision = useCurrentRevision()
  const table = useCurrentTable()
  const row = useCurrentRow()

  const [store] = useState(() => {
    return new ProjectPageModel(
      rootStore.cache,
      revalidator.revalidate,
      params,
      organization,
      project,
      branch,
      revision,
      table,
      row,
    )
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  useEffect(() => {
    store.update({
      params,
      organization,
      project,
      branch,
      revision,
      table,
      row,
    })
  }, [store, params, organization, project, branch, revision, table, row])

  return store
}
