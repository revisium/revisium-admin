import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { observer } from 'mobx-react-lite'
import { formatDate } from 'src/shared/lib/helpers/formatDate'
import { Flex } from '@chakra-ui/react'
import { RowStringEditor } from '../RowStringEditor/RowStringEditor'

interface RowDatePickerProps {
  store: JsonStringValueStore
  readonly?: boolean
  dataTestId?: string
}

export const RowDatePicker: FC<RowDatePickerProps> = observer(({ store, readonly, dataTestId }) => {
  const dateValue = store.value ? formatDate(store.value, "yyyy-MM-dd'T'HH:mm") : ''

  return (
    <Flex pl="4px">
      <RowStringEditor store={store} />
      <input
        style={{ width: '20px' }}
        data-testid={`${dataTestId}-select-date`}
        type="datetime-local"
        readOnly={readonly}
        value={dateValue}
        onChange={(e) => store.setValue(new Date(e.target.value).toISOString())}
      />
    </Flex>
  )
})
