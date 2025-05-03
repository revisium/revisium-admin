import { Box, Flex, IconButton } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { PiEyeThin, PiLinkThin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowEditorMode, useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'

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

  const handleChange = useCallback(
    (value: string) => {
      store.setValue(value)
    },
    [store],
  )

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
      <Box ml="2px" pl="4px" pr="4px" minHeight="24px" minWidth="15px" cursor={readonly ? 'not-allowed' : undefined}>
        {readonly ? (
          `"${store.getPlainValue()}"`
        ) : (
          <ContentEditable
            dataTestId={dataTestId}
            prefix='"'
            postfix='"'
            initValue={store.getPlainValue()}
            onChange={handleChange}
          />
        )}
      </Box>
      {showViewForeignKey && (
        <IconButton
          data-testid={`${dataTestId}-view-foreign-key`}
          _hover={{ backgroundColor: 'gray.100' }}
          aria-label=""
          height="24px"
          icon={<PiEyeThin />}
          variant="ghost"
          onClick={handleViewForeignKey}
          className={styles.SelectForeignKeyButton}
        />
      )}
      {showSelectForeignKey && (
        <IconButton
          data-testid={`${dataTestId}-select-foreign-key`}
          isLoading={isLoading}
          _hover={{ backgroundColor: 'gray.100' }}
          aria-label=""
          height="24px"
          icon={<PiLinkThin />}
          variant="ghost"
          onClick={handleSelectForeignKey}
          className={styles.SelectForeignKeyButton}
        />
      )}
    </Flex>
  )
})
