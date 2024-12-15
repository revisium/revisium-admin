import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { RowArrayEditor } from 'src/entities/Schema/ui/RowArrayEditor/RowArrayEditor.tsx'
import { RowBooleanEditor } from 'src/entities/Schema/ui/RowBooleanEditor/RowBooleanEditor.tsx'
import { RowFieldEditor } from 'src/entities/Schema/ui/RowFieldEditor/RowFieldEditor.tsx'
import { RowNumberEditor } from 'src/entities/Schema/ui/RowNumberEditor/RowNumberEditor.tsx'
import { RowObjectEditor } from 'src/entities/Schema/ui/RowObjectEditor/RowObjectEditor.tsx'
import { RowStringEditor } from 'src/entities/Schema/ui/RowStringEditor/RowStringEditor.tsx'

interface TreeDataCardProps {
  store: RowDataCardStore
  isEdit: boolean
  rootName?: string
  rootValue?: React.ReactNode
}

export const TreeDataCard: React.FC<TreeDataCardProps> = observer(({ rootName, rootValue, isEdit, store }) => {
  const childDataTestId = '0'

  return (
    <>
      <Flex flexDirection="column" width="100%" flex={1} marginBottom="8rem">
        <RowFieldEditor colorName="gray.400" name={rootName} value={rootValue}>
          {store.root.type === JsonSchemaTypeName.Object && (
            <RowObjectEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />
          )}
          {store.root.type === JsonSchemaTypeName.Array && (
            <RowArrayEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />
          )}
          {store.root.type === JsonSchemaTypeName.String && (
            <RowFieldEditor
              colorName="gray.400"
              name="<root value>"
              value={<RowStringEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />}
            />
          )}
          {store.root.type === JsonSchemaTypeName.Number && (
            <RowFieldEditor
              colorName="gray.400"
              name="<root value>"
              value={<RowNumberEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />}
            />
          )}
          {store.root.type === JsonSchemaTypeName.Boolean && (
            <RowFieldEditor
              colorName="gray.400"
              name="<root value>"
              value={<RowBooleanEditor dataTestId={childDataTestId} readonly={!isEdit} store={store.root} />}
            />
          )}
        </RowFieldEditor>
      </Flex>
    </>
  )
})
