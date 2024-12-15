import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'

const OnlyLatins = /^[.\d]+$/

interface RowNumberEditorProps {
  store: JsonNumberValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowNumberEditor: React.FC<RowNumberEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const handleChange = useCallback(
    (value: string) => {
      const parsedValue = parseFloat(value)
      if (!isNaN(parsedValue)) {
        store.setValue(parsedValue)
      } else {
        store.setValue(store.default)
      }
    },
    [store],
  )

  return (
    <Box ml="2px" pl="4px" pr="4px" height="24px" minWidth="15px" cursor={readonly ? 'not-allowed' : undefined}>
      {readonly ? (
        store.getPlainValue() ?? '""'
      ) : (
        <ContentEditable
          dataTestId={dataTestId}
          initValue={store.getPlainValue().toString()}
          onChange={handleChange}
          restrict={OnlyLatins}
        />
      )}
    </Box>
  )
})
