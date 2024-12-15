import { Input } from '@chakra-ui/react'
import React, { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from 'react'

import { useInputAutofocus } from 'src/shared/lib'

interface CardInputProps {
  value?: string
  placeholder?: string
  autoFocus?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onEnter?: () => void
  width?: string
  height?: string
  type?: HTMLInputTypeAttribute | undefined
  dataTestId?: string
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined
}

export const CardInput: React.FC<CardInputProps> = ({
  value,
  placeholder,
  autoFocus,
  onChange,
  onBlur,
  onEnter,
  width,
  height,
  type,
  dataTestId,
  autoComplete,
}) => {
  const autofocusRef = useInputAutofocus()

  return (
    <Input
      autoComplete={autoComplete}
      data-testid={dataTestId}
      borderColor="gray.100"
      borderStyle="solid"
      borderWidth="1px"
      padding="0 9px"
      placeholder={placeholder}
      ref={autoFocus ? autofocusRef : undefined}
      value={value}
      variant="unstyled"
      onChange={onChange}
      onBlur={onBlur}
      width={width}
      height={height}
      type={type}
      onKeyDown={
        onEnter
          ? (e) => {
              if (e.key === 'Enter') {
                onEnter()
              }
            }
          : undefined
      }
    />
  )
}
