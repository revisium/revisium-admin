import { useEffect, useState } from 'react'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const useLinkMaker = () => {
  const [store] = useState(() => {
    return new LinkMaker(container.get(ProjectContext))
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
