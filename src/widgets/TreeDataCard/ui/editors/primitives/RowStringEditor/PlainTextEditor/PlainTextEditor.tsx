import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode'
import { StringParentValueNode } from 'src/widgets/TreeDataCard/model/StringParentValueNode'
import { PrimitiveBox } from 'src/widgets/TreeDataCard/ui/editors/primitives/PrimitiveBox/PrimitiveBox.tsx'

export interface PlainTextEditorProps {
  node?: BaseValueNode
  store?: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const PlainTextEditor: FC<PlainTextEditorProps> = observer(({ node, store, readonly, dataTestId }) => {
  const actualStore = node ? (node.getStore() as JsonStringValueStore) : store!
  const storeValue = actualStore.getPlainValue()
  const [value, setValue] = useState(storeValue)

  useEffect(() => {
    setValue(storeValue)
  }, [storeValue])

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  const handleBlur = useCallback(() => {
    if (node && node instanceof StringParentValueNode) {
      const wasCollapsible = node.isCollapsible

      actualStore.setValue(value)

      if (!wasCollapsible && node.isCollapsible) {
        node.expanded = true
      }
    } else {
      actualStore.setValue(value)
    }
  }, [actualStore, value, node])

  const prefix = value ? '' : '"'

  return (
    <PrimitiveBox
      prefix={prefix}
      postfix={prefix}
      value={value}
      readonly={readonly}
      dataTestId={dataTestId}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
})
