import { Badge } from '@chakra-ui/react'
import { FC } from 'react'

interface ApiKeyStatusBadgeProps {
  status: 'Active' | 'Expired' | 'Revoked'
}

const statusConfig = {
  Active: { colorPalette: 'green' },
  Expired: { colorPalette: 'yellow' },
  Revoked: { colorPalette: 'gray' },
} as const

export const ApiKeyStatusBadge: FC<ApiKeyStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status]

  return (
    <Badge variant="subtle" colorPalette={config.colorPalette} size="sm">
      {status}
    </Badge>
  )
}
