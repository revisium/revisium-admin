import { useEffect, useState } from 'react'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { RevisionPageQueries } from 'src/features/RevisionsCard/model/RevisionPageQueries.ts'
import { RevisionsCardModel } from 'src/features/RevisionsCard/model/RevisionsCardModel.ts'
import { MiddleRevisionsFinder } from 'src/features/RevisionsCard/model/MiddleRevisionsFinder.ts'
import { RevisionsCardItemsModel } from 'src/features/RevisionsCard/model/RevisionsCardItemsModel.ts'
import { MiddleRevisions } from 'src/features/RevisionsCard/model/MiddleRevisions.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const useRevisionsCardModel = () => {
  const linkMaker = useLinkMaker()
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    const middleRevisionsFinder = new MiddleRevisionsFinder(projectPageModel)
    const middleRevisions = new MiddleRevisions(projectPageModel, middleRevisionsFinder)
    const revisionsCardItemsModel = new RevisionsCardItemsModel(projectPageModel, linkMaker, middleRevisions)
    const revisionsPageQueries = new RevisionPageQueries(projectPageModel)
    return new RevisionsCardModel(
      rootStore.cache,
      projectPageModel,
      revisionsCardItemsModel,
      middleRevisions,
      revisionsPageQueries,
    )
  })

  useEffect(() => {
    store.init()
    return () => store.dispose()
  }, [store])

  return store
}
