import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { ForeignKeyMenu } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowForeignKeyEditor/ForeignKeyMenu.tsx'
import { PlainTextEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/PlainTextEditor/PlainTextEditor.tsx'

interface RowStringEditorProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowForeignKeyEditor: FC<RowStringEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const handleSelect = useCallback(
    (value: string) => {
      store.setValue(value)
    },
    [store],
  )

  return (
    <ForeignKeyMenu store={store} onChange={handleSelect} disabled={readonly}>
      <Flex data-testid={`${dataTestId}-string`}>
        <PlainTextEditor store={store} dataTestId={dataTestId} readonly={readonly} />
      </Flex>
    </ForeignKeyMenu>
  )
})
