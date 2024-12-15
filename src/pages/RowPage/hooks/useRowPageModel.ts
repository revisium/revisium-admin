import { useEffect, useState } from 'react'
import { RowPageModel } from 'src/pages/RowPage/model/RowPageModel.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

export const useRowPageModel = () => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new RowPageModel(projectPageModel)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
