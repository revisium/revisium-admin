import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

export interface PlainTextEditorProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const PlainTextEditor: FC<PlainTextEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const handleChange = useCallback(
    (value: string) => {
      store.setValue(value)
    },
    [store],
  )

  return (
    <PrimitiveBox
      prefix='"'
      postfix='"'
      value={store.getPlainValue()}
      readonly={readonly}
      dataTestId={dataTestId}
      onChange={handleChange}
    />
  )
})
