import { useParams } from 'react-router-dom'

export const useTableId = () => {
  const { tableId } = useParams()

  if (!tableId) {
    throw new Error('Invalid tableId')
  }

  return tableId
}
