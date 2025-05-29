import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { SchemaEditorActions, SchemaEditorMode } from 'src/widgets/SchemaEditor/model/SchemaEditorActions.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'
import { RootNode } from 'src/widgets/SchemaEditor/ui/SchemaEditor/RootNode.tsx'
import { ApproveButton, CloseButton } from 'src/shared/ui'
import { BackButton2 } from 'src/shared/ui/BackButton2/BackButton2.tsx'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'

import styles from './SchemaEditor.module.scss'

interface SchemaEditorProps {
  store: RootNodeStore
  mode: SchemaEditorMode
  onApprove: () => Promise<void>
  onCancel: () => void
  onSelectForeignKey: (node: StringForeignKeyNodeStore) => void
}

export const SchemaEditor: React.FC<SchemaEditorProps> = observer(
  ({ store, mode, onApprove, onCancel, onSelectForeignKey }) => {
    const [loading, setLoading] = useState(false)

    const handleApprove = useCallback(async () => {
      setLoading(true)
      await onApprove()
      setLoading(false)
    }, [onApprove])

    return (
      <SchemaEditorActions.Provider
        value={{
          onSelectForeignKey: onSelectForeignKey,
          mode,
          root: store,
        }}
      >
        <Flex flex={1} flexDirection="column" gap="0.5rem" className={styles.Root} date-testid="schema-data-card">
          <Flex justifyContent="space-between" width="100%" alignItems="center" paddingBottom="8px">
            <Box>
              {mode === SchemaEditorMode.Creating ? (
                <CloseButton dataTestId="close-create-table-button" onClick={onCancel} />
              ) : (
                <BackButton2 dataTestId="back-to-table-list-button" onClick={onCancel} />
              )}
              <ApproveButton
                dataTestId="schema-editor-approve-button"
                onClick={handleApprove}
                isDisabled={store.isApproveDisabled}
                loading={loading}
              />
              {mode === SchemaEditorMode.Updating && store.isDirty && (
                <RevertButton dataTestId="schema-editor-revert-button" onClick={store.resetChanges} />
              )}
            </Box>
            <Box className={styles.Actions}>
              <RowViewerSwitcher
                availableRefByMode={false}
                mode={store.viewMode || ViewerSwitcherMode.Tree}
                onChange={store.setViewMode}
              />
            </Box>
          </Flex>
          {store.viewMode === ViewerSwitcherMode.Tree && (
            <Box paddingBottom="4rem">
              <RootNode store={store} />
            </Box>
          )}
          {store.viewMode === ViewerSwitcherMode.Json && <JsonCard data={store.getPlainSchema()} />}
        </Flex>
      </SchemaEditorActions.Provider>
    )
  },
)
