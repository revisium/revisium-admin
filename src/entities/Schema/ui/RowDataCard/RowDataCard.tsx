import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { RefsByDataCard } from 'src/entities/Schema/ui/RefsByDataCard/RefsByDataCard.tsx'

import styles from 'src/entities/Schema/ui/RowDataCard/RowDataCard.module.scss'
import { RowDataCardFooter } from 'src/entities/Schema/ui/RowDataCardFooter/RowDataCardFooter.tsx'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { TreeDataCard } from 'src/entities/Schema/ui/TreeDataCard/TreeDataCard.tsx'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'

interface RowDataCardProps {
  store: RowDataCardStore
  isEdit: boolean
  rootName?: string
  rootValue?: React.ReactNode
  actions?: React.ReactNode
}

export const RowDataCard: React.FC<RowDataCardProps> = observer(({ store, rootName, rootValue, isEdit, actions }) => {
  return (
    <Flex
      alignItems="flex-start"
      flexDirection="column"
      gap="1rem"
      className={styles.Root}
      flex={1}
      date-testid="row-data-card"
    >
      <Flex justifyContent="space-between" width="100%" alignItems="center" paddingBottom="8px">
        <Flex minHeight="40px">{actions}</Flex>
        <Box className={styles.Actions}>
          <RowViewerSwitcher
            availableRefByMode={store.areThereReferencesBy}
            mode={store.viewMode || ViewerSwitcherMode.Tree}
            onChange={store.setViewMode}
          />
        </Box>
      </Flex>
      {store.viewMode === ViewerSwitcherMode.Tree && (
        <TreeDataCard rootValue={rootValue} rootName={rootName} store={store} isEdit={isEdit} />
      )}
      {store.viewMode === ViewerSwitcherMode.Json && <JsonCard data={store.root.getPlainValue()} />}
      {store.viewMode === ViewerSwitcherMode.RefBy && store.originRow && <RefsByDataCard row={store.originRow} />}
      <RowDataCardFooter store={store} />
    </Flex>
  )
})
