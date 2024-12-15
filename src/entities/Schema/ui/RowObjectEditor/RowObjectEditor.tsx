import { observer } from 'mobx-react-lite'
import React from 'react'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { RowArrayEditor } from 'src/entities/Schema/ui/RowArrayEditor/RowArrayEditor.tsx'
import { RowBooleanEditor } from 'src/entities/Schema/ui/RowBooleanEditor/RowBooleanEditor.tsx'
import { RowFieldEditor } from 'src/entities/Schema/ui/RowFieldEditor/RowFieldEditor.tsx'
import { RowNumberEditor } from 'src/entities/Schema/ui/RowNumberEditor/RowNumberEditor.tsx'
import { RowStringEditor } from 'src/entities/Schema/ui/RowStringEditor/RowStringEditor.tsx'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'

interface RowObjectProps {
  store: JsonObjectValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowObjectEditor: React.FC<RowObjectProps> = observer(({ store: store, readonly, dataTestId }) => {
  const fields = Object.entries(store.value)

  const actions = useRowEditorActions()

  return (
    <>
      {fields.map(([name, item], index) => {
        const childDataTestId = `${dataTestId}-${index}`

        return (
          <RowFieldEditor
            onOverLabel={() => {
              actions.onOverNode(item)
            }}
            onOutLabel={() => {
              actions.onOverNode(null)
            }}
            colorName="gray.400"
            key={name}
            name={name}
            value={
              <>
                {item.type === JsonSchemaTypeName.String && (
                  <RowStringEditor dataTestId={childDataTestId} readonly={readonly} store={item} />
                )}
                {item.type === JsonSchemaTypeName.Number && (
                  <RowNumberEditor dataTestId={childDataTestId} readonly={readonly} store={item} />
                )}
                {item.type === JsonSchemaTypeName.Boolean && (
                  <RowBooleanEditor dataTestId={childDataTestId} readonly={readonly} store={item} />
                )}
              </>
            }
          >
            {item.type === JsonSchemaTypeName.Object && (
              <RowObjectEditor dataTestId={childDataTestId} readonly={readonly} store={item} />
            )}
            {item.type === JsonSchemaTypeName.Array && (
              <RowArrayEditor dataTestId={childDataTestId} readonly={readonly} store={item} />
            )}
          </RowFieldEditor>
        )
      })}
    </>
  )
})
