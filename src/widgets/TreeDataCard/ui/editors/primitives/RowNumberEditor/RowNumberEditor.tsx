import React, { useCallback, useEffect, useState } from 'react'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

const OnlyDigitsDotDash = /^[\d.-]+$/

interface RowNumberEditorProps {
  value: number
  setValue: (value: number) => void
  defaultValue: number
  readonly?: boolean
  dataTestId?: string
}

export const RowNumberEditor: React.FC<RowNumberEditorProps> = ({
  value,
  setValue,
  defaultValue,
  readonly,
  dataTestId,
}) => {
  const stringValue = value.toString()

  const [state, setState] = useState(stringValue)

  useEffect(() => {
    setState(stringValue)
  }, [stringValue])

  const handleChange = useCallback((value: string) => {
    setState(value)
  }, [])

  const handleBlur = useCallback(() => {
    const parsedValue = Number.parseFloat(state)
    if (!Number.isNaN(parsedValue)) {
      setValue(parsedValue)
      setState(parsedValue.toString())
    } else {
      setValue(defaultValue)
      setState(defaultValue.toString())
    }
  }, [defaultValue, setValue, state])

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
}
