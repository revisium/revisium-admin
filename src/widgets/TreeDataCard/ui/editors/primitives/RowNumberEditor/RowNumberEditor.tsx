import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useState } from 'react'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

const OnlyDigitsDotDash = /^[\d.-]+$/

interface RowNumberEditorProps {
  store: JsonNumberValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowNumberEditor: React.FC<RowNumberEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const storeState = store.getPlainValue().toString()
  const [state, setState] = useState(storeState)

  useEffect(() => {
    setState(storeState)
  }, [storeState])

  const handleChange = useCallback((value: string) => {
    setState(value)
  }, [])

  const handleBlur = useCallback(() => {
    const parsedValue = Number.parseFloat(state)
    if (!Number.isNaN(parsedValue)) {
      store.setValue(parsedValue)
      setState(parsedValue.toString())
    } else {
      store.setValue(store.default)
      setState(store.default.toString())
    }
  }, [store, state])

  return (
    <PrimitiveBox
      value={state}
      readonly={readonly}
      dataTestId={dataTestId}
      onChange={handleChange}
      onBlur={handleBlur}
      restrict={OnlyDigitsDotDash}
    />
  )
})
