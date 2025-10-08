import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable'

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
    <Box ml="2px" pl="4px" pr="4px" height="24px" minWidth="15px" cursor={readonly ? 'not-allowed' : undefined}>
      {readonly ? (
        store.getPlainValue().toString() ?? '""'
      ) : (
        <ContentEditable dataTestId={dataTestId} initValue={state} onChange={handleChange} onBlur={handleBlur} />
      )}
    </Box>
  )
})
