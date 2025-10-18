import { FC, useCallback, useEffect, useState } from 'react'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

export interface PlainTextEditorProps {
  value: string
  setValue: (value: string) => void
  readonly?: boolean
  dataTestId?: string
}

export const PlainTextEditor: FC<PlainTextEditorProps> = ({ value, setValue, readonly, dataTestId }) => {
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue)
  }, [])

  const handleBlur = useCallback(() => {
    setValue(internalValue)
  }, [internalValue, setValue])

  const prefix = internalValue ? '' : '"'

  return (
    <PrimitiveBox
      prefix={prefix}
      postfix={prefix}
      value={internalValue}
      readonly={readonly}
      dataTestId={dataTestId}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
