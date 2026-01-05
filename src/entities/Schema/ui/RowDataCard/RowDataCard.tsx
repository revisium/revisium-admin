import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { toSortedJsonValue, ViewerSwitcherMode } from 'src/entities/Schema'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { ForeignKeysByDataCard } from 'src/entities/Schema/ui/ForeignKeysByDataCard/ForeignKeysByDataCard.tsx'

import styles from 'src/entities/Schema/ui/RowDataCard/RowDataCard.module.scss'
import { RowDataCardFooter } from 'src/entities/Schema/ui/RowDataCardFooter/RowDataCardFooter.tsx'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { TreeDataCardWidget } from 'src/widgets/TreeDataCard'

interface RowDataCardProps {
  store: RowDataCardStore
  tableId: string
  isEdit: boolean
}

export const RowDataCard: React.FC<RowDataCardProps> = observer(({ store, tableId, isEdit }) => {
  return (
    <Flex
      alignItems="flex-start"
      flexDirection="column"
      gap="1rem"
      className={styles.Root}
      flex={1}
      minHeight="100vh"
      date-testid="row-data-card"
    >
      {store.viewMode === ViewerSwitcherMode.Tree && (
        <>
          <Box flexGrow={1} width="100%">
            <TreeDataCardWidget store={store.node} isEdit={isEdit} />
          </Box>
          <RowDataCardFooter store={store} />
        </>
      )}
      {store.viewMode === ViewerSwitcherMode.Json && (
        <JsonCard
          schema={store.schemaStore.getPlainSchema()}
          readonly={!isEdit}
          data={toSortedJsonValue(store.root)}
          onChange={store.updateValue}
        />
      )}
      {store.viewMode === ViewerSwitcherMode.RefBy && (
        <ForeignKeysByDataCard tableId={tableId} rowId={store.name.baseValue} />
      )}
    </Flex>
  )
})
