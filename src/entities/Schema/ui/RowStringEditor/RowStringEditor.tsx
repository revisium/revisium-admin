import { Flex, IconButton } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { PiEyeThin, PiLinkThin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { MarkdownEditor } from 'src/entities/Schema/ui/RowStringEditor/MarkdownEditor/MarkdownEditor.tsx'
import { PlainTextEditor } from 'src/entities/Schema/ui/RowStringEditor/PlainTextEditor/PlainTextEditor.tsx'
import { RowEditorMode, useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'

import styles from './RowStringEditor.module.scss'

interface RowStringEditorProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowStringEditor: React.FC<RowStringEditorProps> = observer(({ store, readonly, dataTestId }) => {
  const linkMaker = useLinkMaker()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const { onSelectForeignKey, mode } = useRowEditorActions()

  const handleSelectForeignKey = useCallback(async () => {
    setIsLoading(true)
    await onSelectForeignKey(store)
    setIsLoading(false)
  }, [onSelectForeignKey, store])

  const handleViewForeignKey = useCallback(async () => {
    navigate(
      linkMaker.make({
        ...linkMaker.getCurrentOptions(),
        tableId: store.foreignKey,
        rowId: store.getPlainValue(),
      }),
      { state: { isBackToRow: true } },
    )
  }, [linkMaker, navigate, store])

  const showSelectForeignKey = store.foreignKey && !readonly
  const showViewForeignKey = store.foreignKey && mode !== RowEditorMode.Creating && store.getPlainValue()

  return (
    <Flex className={styles.Field}>
      {store.contentMediaType === 'text/markdown' ? (
        <MarkdownEditor store={store} dataTestId={dataTestId} readonly={readonly} />
      ) : (
        <PlainTextEditor store={store} dataTestId={dataTestId} readonly={readonly} />
      )}
      {showViewForeignKey && (
        <IconButton
          data-testid={`${dataTestId}-view-foreign-key`}
          _hover={{ backgroundColor: 'gray.100' }}
          aria-label=""
          height="24px"
          variant="ghost"
          onClick={handleViewForeignKey}
          className={styles.SelectForeignKeyButton}
          size="sm"
        >
          <PiEyeThin />
        </IconButton>
      )}
      {showSelectForeignKey && (
        <IconButton
          data-testid={`${dataTestId}-select-foreign-key`}
          loading={isLoading}
          _hover={{ backgroundColor: 'gray.100' }}
          aria-label=""
          height="24px"
          variant="ghost"
          onClick={handleSelectForeignKey}
          className={styles.SelectForeignKeyButton}
          size="sm"
        >
          <PiLinkThin />
        </IconButton>
      )}
    </Flex>
  )
})
