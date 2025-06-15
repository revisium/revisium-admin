import { FC } from 'react'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { FilePluginActions } from 'src/entities/Schema/ui/FilePluginActions/FilePluginActions.tsx'
import styles from 'src/entities/Schema/ui/RowObjectEditor/RowObjectEditor.module.scss'
import { getColumnBySchema } from 'src/widgets/RowList/lib/getColumnBySchema.ts'
import { BaseCell } from 'src/widgets/RowList/ui/Cell/BaseCell.tsx'

interface CellProps {
  isEdit: boolean
  store: JsonValueStore
  isLastCell: boolean
}

export const Cell: FC<CellProps> = ({ isLastCell, store }) => {
  if (store instanceof JsonObjectValueStore && store.$ref === SystemSchemaIds.File) {
    return (
      <BaseCell isLastCell={isLastCell} width={`${getColumnBySchema(store.schema)}px`}>
        <FilePluginActions hoverClassName={styles.Action} readonly hideInfo store={store} />
      </BaseCell>
    )
  }

  return (
    <BaseCell isLastCell={isLastCell} width={`${getColumnBySchema(store.schema)}px`}>
      {store instanceof JsonStringValueStore && store.value}
      {store instanceof JsonNumberValueStore && store.value}
      {store instanceof JsonBooleanValueStore && String(store.getPlainValue())}
      {store instanceof JsonObjectValueStore && '{...}'}
      {store instanceof JsonArrayValueStore && '[...]'}
    </BaseCell>
  )
}
