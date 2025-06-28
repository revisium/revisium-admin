import { useEffect, useState } from 'react'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowAIWidgetModel } from 'src/widgets/RowAIWidget/model/RowAIWidgetModel.ts'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

export const useRowAIWidgetModel = (data: JsonValue, rowId: string, onChange: (data: JsonValue) => void) => {
  const projectPageModel = useProjectPageModel()

  const [store] = useState(() => {
    return new RowAIWidgetModel(projectPageModel, data, rowId, onChange)
  })

  useEffect(() => {
    store.init()

    return () => store.dispose()
  }, [store])

  return store
}
