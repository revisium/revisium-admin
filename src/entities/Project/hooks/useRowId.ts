import { useParams } from 'react-router-dom'

export const useRowId = () => {
  const { rowId } = useParams()

  if (!rowId) {
    throw new Error('Invalid rowId')
  }

  return rowId
}
