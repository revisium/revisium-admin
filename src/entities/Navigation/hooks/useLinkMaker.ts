import { useEffect, useState } from 'react'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

export const useLinkMaker = () => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new LinkMaker(projectPageModel)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
