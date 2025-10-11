import { Flex, Text, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { SearchForeignKeyViewModel } from 'src/features/SearchForeignKey/model/SearchForeignKeyViewModel.ts'
import { Empty } from 'src/features/SearchForeignKey/ui/SearchForeignKey/Empty.tsx'
import { Footer } from 'src/features/SearchForeignKey/ui/SearchForeignKey/Footer.tsx'
import { Header } from 'src/features/SearchForeignKey/ui/SearchForeignKey/Header.tsx'
import { List } from 'src/features/SearchForeignKey/ui/SearchForeignKey/List.tsx'
import { SearchInput } from 'src/features/SearchForeignKey/ui/SearchForeignKey/SearchInput.tsx'
import { useViewModel } from 'src/shared/lib'

interface SearchForeignKeyProps {
  revisionId: string
  tableId: string
  onChange: (value: string) => void
  onOpenTableSearch: () => void
  onCreateAndConnect: () => void
  onClose?: () => void
}

export const SearchForeignKey: FC<SearchForeignKeyProps> = observer(
  ({ revisionId, tableId, onChange, onOpenTableSearch, onCreateAndConnect, onClose }) => {
    const model = useViewModel(SearchForeignKeyViewModel, revisionId, tableId)

    const handleSelect = useCallback(
      (value: string) => {
        onChange(value)
      },
      [onChange],
    )

    const handleOpenTableSearch = useCallback(() => {
      onOpenTableSearch?.()
    }, [onOpenTableSearch])

    return (
      <Flex flexDirection="column" height="290px" width="100%">
        <Header tableId={tableId} onClose={onClose} />

        {model.showInput && <SearchInput model={model} />}

        {model.showLoading && (
          <Flex justify="center" align="center" height="100%" width="100%">
            <Spinner size="md" color="blue.500" />
          </Flex>
        )}

        {model.showNotFound && (
          <Flex justify="center" align="center" height="100%" width="100%">
            <Text fontSize="sm" color="gray.500">
              No results found
            </Text>
          </Flex>
        )}

        {model.showEmpty && <Empty />}

        {model.showList && <List ids={model.items} onSelect={handleSelect} />}

        {model.showFooter && <Footer onTable={handleOpenTableSearch} onCreate={onCreateAndConnect} />}
      </Flex>
    )
  },
)
