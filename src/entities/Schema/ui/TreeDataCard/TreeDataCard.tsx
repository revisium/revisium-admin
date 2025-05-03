import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { FilePluginActions } from 'src/entities/Schema/ui/FilePluginActions/FilePluginActions.tsx'
import { RowArrayEditor } from 'src/entities/Schema/ui/RowArrayEditor/RowArrayEditor.tsx'
import { RowBooleanEditor } from 'src/entities/Schema/ui/RowBooleanEditor/RowBooleanEditor.tsx'
import { RowFieldEditor } from 'src/entities/Schema/ui/RowFieldEditor/RowFieldEditor.tsx'
import { RowNumberEditor } from 'src/entities/Schema/ui/RowNumberEditor/RowNumberEditor.tsx'
import { RowObjectEditor } from 'src/entities/Schema/ui/RowObjectEditor/RowObjectEditor.tsx'
import { RowStringEditor } from 'src/entities/Schema/ui/RowStringEditor/RowStringEditor.tsx'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'

import styles from './TreeDataCard.module.scss'

interface TreeDataCardProps {
  store: RowDataCardStore
  isEdit: boolean
  rootName?: string
  rootValue?: React.ReactNode
}

export const TreeDataCard: React.FC<TreeDataCardProps> = observer(({ rootName, rootValue, isEdit, store }) => {
  const childDataTestId = '0'

  const actions = useRowEditorActions()

  return (
    <>
      <Flex flexDirection="column" width="100%" flex={1} marginBottom="8rem">
        <RowFieldEditor colorName="gray.400" name={rootName} value={rootValue}>
          {store.root.type === JsonSchemaTypeName.Object && store.root.$ref === SystemSchemaIds.File && (
            <RowFieldEditor
              colorName="gray.400"
              name="File"
              nameAndValueClassName={styles.Field}
              value={
                <Box className={styles.Actions}>
                  <FilePluginActions readonly={!isEdit} store={store.root} onUpload={actions.onUploadFile} />
                </Box>
              }
            >
              <RowObjectEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />
            </RowFieldEditor>
          )}
          {store.root.type === JsonSchemaTypeName.Object && store.root.$ref !== SystemSchemaIds.File && (
            <RowObjectEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />
          )}
          {store.root.type === JsonSchemaTypeName.Array && (
            <RowArrayEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />
          )}
          {store.root.type === JsonSchemaTypeName.String && (
            <RowFieldEditor
              colorName="gray.400"
              name="<root value>"
              value={
                <RowStringEditor
                  dataTestId={childDataTestId}
                  readonly={!isEdit || store.root.readOnly}
                  store={store.root}
                />
              }
            />
          )}
          {store.root.type === JsonSchemaTypeName.Number && (
            <RowFieldEditor
              colorName="gray.400"
              name="<root value>"
              value={
                <RowNumberEditor
                  dataTestId={childDataTestId}
                  readonly={!isEdit || store.root.readOnly}
                  store={store.root}
                />
              }
            />
          )}
          {store.root.type === JsonSchemaTypeName.Boolean && (
            <RowFieldEditor
              colorName="gray.400"
              name="<root value>"
              value={
                <RowBooleanEditor
                  dataTestId={childDataTestId}
                  readonly={!isEdit || store.root.readOnly}
                  store={store.root}
                />
              }
            />
          )}
        </RowFieldEditor>
      </Flex>
    </>
  )
})
