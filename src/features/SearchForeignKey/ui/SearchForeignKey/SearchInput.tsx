import { CloseButton, Input, InputGroup } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { ChangeEventHandler, FC, useCallback } from 'react'
import { SearchForeignKeyViewModel } from 'src/features/SearchForeignKey/model/SearchForeignKeyViewModel.ts'

interface SearchInputProps {
  model: SearchForeignKeyViewModel
}

export const SearchInput: FC<SearchInputProps> = observer(({ model }) => {
  const handleSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      model.setSearch(event.target.value)
    },
    [model],
  )

  const handleClear = useCallback(() => {
    model.setSearch('', true)
  }, [model])

  return (
    <InputGroup endElement={model.search && <CloseButton color="gray.400" size="xs" me="-1" onClick={handleClear} />}>
      <Input
        m="4px"
        borderColor="gray.200"
        variant="outline"
        value={model.search}
        onChange={handleSearch}
        _placeholder={{ color: 'gray.400' }}
        placeholder="Search by ID or any field…"
        size="sm"
      />
    </InputGroup>
  )
})
