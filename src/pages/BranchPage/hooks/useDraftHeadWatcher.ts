import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { DraftHeadWatcher } from 'src/pages/BranchPage/model/DraftHeadWatcher.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

export const useDraftHeadWatcher = () => {
  const linkMaker = useLinkMaker()
  const navigate = useNavigate()
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new DraftHeadWatcher(navigate, linkMaker, projectPageModel)
  })

  useEffect(() => {
    store.init()
    return () => store.dispose()
  }, [store])

  return store
}
