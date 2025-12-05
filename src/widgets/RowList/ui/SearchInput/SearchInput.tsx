import { CloseButton, Input, InputGroup } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { ChangeEventHandler, FC, useCallback } from 'react'
import { LuSearch } from 'react-icons/lu'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export const SearchInput: FC<SearchInputProps> = observer(({ value, onChange, onClear }) => {
  const handleSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange(event.target.value)
    },
    [onChange],
  )

  return (
    <InputGroup
      width="280px"
      startElement={<LuSearch color="gray" />}
      endElement={value && <CloseButton color="gray.400" size="xs" me="-1" onClick={onClear} />}
    >
      <Input
        variant="flushed"
        value={value}
        onChange={handleSearch}
        _placeholder={{ color: 'gray.400' }}
        placeholder="Search by ID or content..."
        size="sm"
      />
    </InputGroup>
  )
})
