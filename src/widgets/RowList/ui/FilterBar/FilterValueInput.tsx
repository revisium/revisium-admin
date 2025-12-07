import { Input, Switch } from '@chakra-ui/react'
import { ChangeEvent, FC } from 'react'
import { FilterFieldType } from 'src/widgets/RowList/model/filterTypes'

interface FilterValueInputProps {
  value: string | number | boolean | null
  fieldType: FilterFieldType
  disabled?: boolean
  error?: boolean
  onChange: (value: string | number | boolean) => void
}

export const FilterValueInput: FC<FilterValueInputProps> = ({ value, fieldType, disabled, error, onChange }) => {
  const handleStringChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? '' : Number(e.target.value)
    onChange(numValue)
  }

  const handleBooleanChange = (details: { checked: boolean }) => {
    onChange(details.checked)
  }

  if (disabled) {
    return null
  }

  switch (fieldType) {
    case FilterFieldType.Boolean:
      return (
        <Switch.Root checked={Boolean(value)} onCheckedChange={handleBooleanChange} size="sm">
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      )

    case FilterFieldType.Number:
      return (
        <Input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={handleNumberChange}
          size="sm"
          width="100px"
          placeholder="Value"
          borderColor={error ? 'red.500' : undefined}
          _focus={{ borderColor: error ? 'red.500' : undefined }}
        />
      )

    case FilterFieldType.String:
    case FilterFieldType.ForeignKey:
    default:
      return (
        <Input
          type="text"
          value={String(value ?? '')}
          onChange={handleStringChange}
          size="sm"
          width="150px"
          placeholder="Value"
          borderColor={error ? 'red.500' : undefined}
          _focus={{ borderColor: error ? 'red.500' : undefined }}
        />
      )
  }
}
