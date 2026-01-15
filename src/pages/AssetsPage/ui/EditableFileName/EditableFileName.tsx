import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { AssetItemViewModel } from 'src/pages/AssetsPage/model/AssetItemViewModel'
import { toaster } from 'src/shared/ui'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable'

interface EditableFileNameProps {
  item: AssetItemViewModel
}

export const EditableFileName: FC<EditableFileNameProps> = observer(({ item }) => {
  const [internalValue, setInternalValue] = useState(item.fileName)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setInternalValue(item.fileName)
  }, [item.fileName])

  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue)
  }, [])

  const handleBlur = useCallback(async () => {
    setFocused(false)

    if (internalValue === item.fileName) {
      return
    }

    const success = await item.updateFileName(internalValue)
    if (!success) {
      setInternalValue(item.fileName)
      toaster.error({ title: 'Failed to update file name', duration: 3000 })
    }
  }, [internalValue, item])

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const isEmpty = !internalValue
  const showBackground = focused || isEmpty

  return (
    <Box
      borderRadius="4px"
      bgColor={showBackground ? 'newGray.100' : undefined}
      _hover={{ bgColor: 'newGray.100' }}
      px="6px"
      py="2px"
      minHeight="28px"
      minWidth={isEmpty ? '140px' : '15px'}
      fontSize="lg"
      fontWeight="semibold"
      lineHeight="1.4"
      mr={2}
    >
      <ContentEditable
        initValue={internalValue}
        placeholder="Enter file name"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  )
})
