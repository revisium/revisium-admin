import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowBooleanEditor } from 'src/entities/Schema/ui/RowBooleanEditor/RowBooleanEditor.tsx'
import { RowFieldEditor } from 'src/entities/Schema/ui/RowFieldEditor/RowFieldEditor.tsx'
import { RowNumberEditor } from 'src/entities/Schema/ui/RowNumberEditor/RowNumberEditor.tsx'
import { RowObjectEditor } from 'src/entities/Schema/ui/RowObjectEditor/RowObjectEditor.tsx'
import { RowStringEditor } from 'src/entities/Schema/ui/RowStringEditor/RowStringEditor.tsx'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { CreateButton } from 'src/shared/ui'
import { RemoveButton } from 'src/shared/ui/RemoveButton/RemoveButton.tsx'

import styles from './RowArrayEditor.module.scss'

interface RowArrayProps {
  store: JsonArrayValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowArrayEditor: React.FC<RowArrayProps> = observer(({ store: store, readonly, dataTestId }) => {
  const items = store.value

  const actions = useRowEditorActions()

  const handleCreate = useCallback(() => {
    store.createItem()
  }, [store])

  return (
    <>
      {items.map((value, index) => {
        const childDataTestId = `${dataTestId}-${index}`

        return (
          <RowFieldEditor
            onOverLabel={() => {
              actions.onOverNode(value)
            }}
            onOutLabel={() => {
              actions.onOverNode(null)
            }}
            key={value.nodeId}
            name={`[${index}]`}
            colorName="gray.400"
            nameAndValueClassName={styles.Field}
            value={
              <Flex>
                {store.items.type === JsonSchemaTypeName.String && (
                  <RowStringEditor
                    dataTestId={childDataTestId}
                    key={index}
                    readonly={readonly}
                    store={value as JsonStringValueStore}
                  />
                )}
                {store.items.type === JsonSchemaTypeName.Number && (
                  <RowNumberEditor
                    dataTestId={childDataTestId}
                    key={index}
                    readonly={readonly}
                    store={value as JsonNumberValueStore}
                  />
                )}
                {store.items.type === JsonSchemaTypeName.Boolean && (
                  <RowBooleanEditor
                    dataTestId={childDataTestId}
                    key={index}
                    readonly={readonly}
                    store={value as JsonBooleanValueStore}
                  />
                )}
                {!readonly && (
                  <RemoveButton
                    dataTestId={`${childDataTestId}-remove-button`}
                    height="26px"
                    aria-label="remove"
                    color="gray.200"
                    _hover={{ color: 'gray.400' }}
                    className={styles.RemoveButton}
                    onClick={() => {
                      store.removeItem(index)
                    }}
                  />
                )}
              </Flex>
            }
          >
            {store.items.type === JsonSchemaTypeName.Object && (
              <RowObjectEditor
                dataTestId={childDataTestId}
                key={index}
                readonly={readonly}
                store={value as JsonObjectValueStore}
              />
            )}
            {store.items.type === JsonSchemaTypeName.Array && (
              <RowArrayEditor
                dataTestId={childDataTestId}
                key={index}
                readonly={readonly}
                store={value as JsonArrayValueStore}
              />
            )}
          </RowFieldEditor>
        )
      })}
      <CreateButton
        dataTestId={`${dataTestId}-create-button`}
        isDisabled={readonly}
        title="Item"
        onClick={handleCreate}
      />
    </>
  )
})