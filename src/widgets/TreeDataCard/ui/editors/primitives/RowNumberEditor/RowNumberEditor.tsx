import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

const OnlyDigitsDotDash = /^[\d.-]+$/

interface RowNumberEditorProps {
  store: JsonNumberValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowNumberEditor: React.FC<RowNumberEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const handleChange = useCallback(
    (value: string) => {
      const parsedValue = Number.parseFloat(value)
      if (!Number.isNaN(parsedValue)) {
        store.setValue(parsedValue)
      } else {
        store.setValue(store.default)
      }
    },
    [store],
  )

  const value = store.getPlainValue().toString()

  return (
    <PrimitiveBox
      value={value}
      readonly={readonly}
      dataTestId={dataTestId}
      onChange={handleChange}
      restrict={OnlyDigitsDotDash}
    />
  )
})
