import { useEffect, useState } from 'react'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { RowStackWidgetModel, RowStackWidgetRowData } from 'src/widgets/RowStackWidget/model/RowStackWidgetModel.ts'

export const useRowStackWidgetModel = (rowData: RowStackWidgetRowData | null, startWithUpdating?: boolean) => {
  const projectContext = container.get(ProjectContext)

  const [store] = useState(() => {
    return new RowStackWidgetModel(projectContext, rowData, startWithUpdating)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
