import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable'

export interface RowIdInputProps {
  value: string
  setValue: (value: string) => void
  readonly?: boolean
  dataTestId?: string
}

export const RowIdInput: FC<RowIdInputProps> = observer(({ value, setValue, readonly, dataTestId }) => {
  const [internalValue, setInternalValue] = useState(value)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue)
  }, [])

  const handleBlur = useCallback(() => {
    setFocused(false)
    setValue(internalValue)
  }, [internalValue, setValue])

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const prefix = internalValue ? '' : '"'

  return (
    <Box
      borderRadius="4px"
      bgColor={focused ? 'newGray.100' : undefined}
      _hover={{
        bgColor: readonly ? undefined : 'newGray.100',
      }}
      pl="4px"
      pr="4px"
      minHeight="24px"
      minWidth="15px"
      cursor={readonly ? 'text' : undefined}
    >
      {readonly ? (
        `${prefix}${internalValue}${prefix}`
      ) : (
        <ContentEditable
          dataTestId={dataTestId}
          prefix={prefix}
          postfix={prefix}
          initValue={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </Box>
  )
})
