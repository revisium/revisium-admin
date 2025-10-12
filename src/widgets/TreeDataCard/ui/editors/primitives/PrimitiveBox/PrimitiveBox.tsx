import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable'

export interface PrimitiveBoxProps {
  value: string
  onChange: (value: string) => void
  readonly?: boolean
  prefix?: string
  postfix?: string
  dataTestId?: string
  restrict?: RegExp
  onFocus?: () => void
  onBlur?: () => void
}

export const PrimitiveBox: FC<PrimitiveBoxProps> = observer(
  ({ value, readonly, prefix = '', postfix = '', restrict, dataTestId, onChange, onFocus, onBlur }) => {
    const [focused, setFocused] = useState(false)

    const handleFocus = useCallback(() => {
      setFocused(true)
      onFocus?.()
    }, [onFocus])

    const handleBlur = useCallback(() => {
      setFocused(false)
      onBlur?.()
    }, [onBlur])

    return (
      <Box
        borderRadius="4px"
        bgColor={focused ? 'blackAlpha.50' : undefined}
        _hover={{
          bgColor: readonly ? undefined : 'blackAlpha.50',
        }}
        mt="2px"
        ml="2px"
        pl="4px"
        pr="4px"
        minHeight="24px"
        minWidth="15px"
        cursor={readonly ? 'text' : undefined}
      >
        {readonly ? (
          `${prefix}${value}${postfix}`
        ) : (
          <ContentEditable
            dataTestId={dataTestId}
            prefix={prefix}
            postfix={postfix}
            initValue={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            restrict={restrict}
          />
        )}
      </Box>
    )
  },
)
