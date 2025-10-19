import React, { useCallback, useEffect, useState } from 'react'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'
import { BooleanMenu } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowBooleanEditor/BooleanMenu.tsx'

interface RowBooleanEditorProps {
  value: boolean
  setValue: (value: boolean) => void
  readonly?: boolean
  dataTestId?: string
}

export const RowBooleanEditor: React.FC<RowBooleanEditorProps> = ({ value, setValue, readonly, dataTestId }) => {
  const stringValue = value.toString()

  const [state, setState] = useState(stringValue)

  useEffect(() => {
    setState(stringValue)
  }, [stringValue])

  const handleChange = useCallback((value: string) => {
    setState(value)
  }, [])

  const handleBlur = useCallback(() => {
    const value = state.toLowerCase() === 'false' || state === '0' ? false : Boolean(state)
    setState(value.toString())
    setValue(value)
  }, [setValue, state])

  const handleBooleanSelect = useCallback(
    (value: boolean) => {
      setState(value.toString())
      setValue(value)
    },
    [setValue],
  )

  return (
    <BooleanMenu onChange={handleBooleanSelect} disabled={readonly}>
      <PrimitiveBox
        value={state}
        readonly={readonly}
        dataTestId={dataTestId}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </BooleanMenu>
  )
}
