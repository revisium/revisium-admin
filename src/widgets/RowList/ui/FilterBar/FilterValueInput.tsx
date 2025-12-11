import { Input, Switch } from '@chakra-ui/react'
import { ChangeEvent, FC, useCallback, useMemo } from 'react'
import { FilterFieldType } from 'src/widgets/RowList/model/filterTypes'

interface FilterValueInputProps {
  value: string | number | boolean | null
  fieldType: FilterFieldType
  disabled?: boolean
  error?: boolean
  onChange: (value: string | number | boolean) => void
}

function toDateTimeLocalValue(isoString: string | null | undefined): string {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}

function fromDateTimeLocalValue(localValue: string): string {
  if (!localValue) return ''
  try {
    const date = new Date(localValue)
    if (isNaN(date.getTime())) return ''
    return date.toISOString()
  } catch {
    return ''
  }
}

export const FilterValueInput: FC<FilterValueInputProps> = ({ value, fieldType, disabled, error, onChange }) => {
  const handleStringChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleNumberChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const numValue = e.target.value === '' ? '' : Number(e.target.value)
      onChange(numValue)
    },
    [onChange],
  )

  const handleBooleanChange = useCallback(
    (details: { checked: boolean }) => {
      onChange(details.checked)
    },
    [onChange],
  )

  const handleDateTimeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isoValue = fromDateTimeLocalValue(e.target.value)
      onChange(isoValue)
    },
    [onChange],
  )

  const dateTimeValue = useMemo(() => toDateTimeLocalValue(String(value ?? '')), [value])

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

    case FilterFieldType.DateTime:
      return (
        <Input
          type="datetime-local"
          value={dateTimeValue}
          onChange={handleDateTimeChange}
          size="sm"
          width="200px"
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
