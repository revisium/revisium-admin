import { Box, Button, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { LuFilter } from 'react-icons/lu'
import { FilterModel } from 'src/widgets/RowList/model/FilterModel'
import {
  FilterableField,
  FilterOperator,
  getDefaultOperator,
  operatorRequiresValue,
  SearchLanguage,
  SearchType,
} from 'src/widgets/RowList/model/filterTypes'
import { FilterOperatorSelect } from '../FilterBar/FilterOperatorSelect'
import { FilterValueInput } from '../FilterBar/FilterValueInput'
import { SearchLanguageSelect, SearchTypeSelect } from '../FilterBar/SearchOptionsSelect'

interface AddFilterPopoverProps {
  field: FilterableField
  filterModel: FilterModel
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

export const AddFilterPopover: FC<AddFilterPopoverProps> = observer(
  ({ field, filterModel, isOpen, onClose, anchorRef }) => {
    const [operator, setOperator] = useState<FilterOperator>(() => getDefaultOperator(field.fieldType))
    const [value, setValue] = useState<string | number | boolean>('')
    const [searchLanguage, setSearchLanguage] = useState<SearchLanguage>('simple')
    const [searchType, setSearchType] = useState<SearchType>(SearchType.Plain)
    const [error, setError] = useState(false)

    const showValueInput = operatorRequiresValue(operator, field.fieldType)
    const isSearchOperator = operator === FilterOperator.Search

    const handleOperatorSelect = useCallback((op: FilterOperator) => {
      setOperator(op)
      setError(false)
    }, [])

    const handleValueChange = useCallback((val: string | number | boolean) => {
      setValue(val)
      setError(false)
    }, [])

    const handleSearchLanguageChange = useCallback((lang: SearchLanguage) => {
      setSearchLanguage(lang)
    }, [])

    const handleSearchTypeChange = useCallback((type: SearchType) => {
      setSearchType(type)
    }, [])

    const resetState = useCallback(() => {
      setOperator(getDefaultOperator(field.fieldType))
      setValue('')
      setSearchLanguage('simple')
      setSearchType(SearchType.Plain)
      setError(false)
    }, [field.fieldType])

    const handleCancel = useCallback(() => {
      resetState()
      onClose()
    }, [resetState, onClose])

    const handleAdd = useCallback(() => {
      const success = filterModel.addQuickFilter(
        field,
        operator,
        value,
        isSearchOperator ? searchLanguage : undefined,
        isSearchOperator ? searchType : undefined,
      )
      if (!success) {
        setError(true)
        return
      }
      resetState()
      onClose()
    }, [filterModel, field, operator, value, isSearchOperator, searchLanguage, searchType, resetState, onClose])

    const getAnchorRect = useCallback(() => {
      return anchorRef.current?.getBoundingClientRect() ?? null
    }, [anchorRef])

    return (
      <Popover.Root
        open={isOpen}
        onOpenChange={({ open }) => {
          if (!open) handleCancel()
        }}
        lazyMount
        unmountOnExit
        autoFocus
        positioning={{
          placement: 'bottom-start',
          getAnchorRect,
        }}
      >
        <Portal>
          <Popover.Positioner>
            <Popover.Content p={3} minW="280px" boxShadow="lg">
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box color="gray.400">
                  <LuFilter size={14} />
                </Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Filter by {field.name}
                </Text>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
                <FilterOperatorSelect
                  selectedOperator={operator}
                  fieldType={field.fieldType}
                  onSelect={handleOperatorSelect}
                />

                {showValueInput && (
                  <FilterValueInput
                    value={value}
                    fieldType={field.fieldType}
                    error={error}
                    onChange={handleValueChange}
                  />
                )}

                {isSearchOperator && (
                  <>
                    <SearchLanguageSelect value={searchLanguage} onChange={handleSearchLanguageChange} />
                    <SearchTypeSelect value={searchType} onChange={handleSearchTypeChange} />
                  </>
                )}
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button size="xs" variant="ghost" colorPalette="gray" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="xs" variant="subtle" colorPalette="gray" onClick={handleAdd}>
                  Add
                </Button>
              </Box>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    )
  },
)
