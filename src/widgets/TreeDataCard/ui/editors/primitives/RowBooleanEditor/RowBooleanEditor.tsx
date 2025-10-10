import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

interface RowBooleanEditorProps {
  store: JsonBooleanValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowBooleanEditor: React.FC<RowBooleanEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const [state, setState] = useState(store.getPlainValue().toString())

  const handleChange = useCallback((value: string) => {
    setState(value)
  }, [])

  const handleBlur = useCallback(() => {
    const value = state.toLowerCase() === 'false' || state === '0' ? false : Boolean(state)
    setState(value.toString())
    store.setValue(value)
  }, [store, state])

  return (
    <PrimitiveBox
      value={state}
      readonly={readonly}
      dataTestId={dataTestId}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
})
