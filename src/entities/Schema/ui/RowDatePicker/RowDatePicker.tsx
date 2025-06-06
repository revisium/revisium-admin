import { FC } from 'react'
import { JsonStringValueStore } from '../../model/value/json-string-value.store'
import { observer } from 'mobx-react-lite'
import { formatDate } from 'src/shared/lib/helpers/formatDate'
import { Box } from '@chakra-ui/react'

interface RowDatePickerProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowDatePicker: FC<RowDatePickerProps> = observer(({ store, readonly, dataTestId }) => {
  const dateValue = store.value ? formatDate(store.value, "yyyy-MM-dd'T'HH:mm") : ''

  return (
    <Box pl="4px">
      <input
        data-testid={`${dataTestId}-select-data`}
        type="datetime-local"
        readOnly={readonly}
        value={dateValue}
        onChange={(e) => store.setValue(new Date(e.target.value).toISOString())}
      />
    </Box>
  )
})
