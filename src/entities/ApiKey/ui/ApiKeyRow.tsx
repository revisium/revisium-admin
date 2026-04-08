import { Badge, Box, Flex, HStack, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { ResolvedProject } from 'src/entities/ApiKey/model/ApiKeyModel.ts'
import { formatDate } from 'src/shared/lib/helpers'
import { formatRelativeTime } from 'src/shared/lib/helpers/formatRelativeTime.ts'
import { ApiKeyStatusBadge } from './ApiKeyStatusBadge.tsx'

interface ApiKeyRowProps {
  name: string
  prefix: string
  status: 'Active' | 'Expired' | 'Revoked'
  permissionLabel: string
  permissionColor: string
  projects: ResolvedProject[]
  lastUsedAt: string | null
  createdAt: string
  expiresAt: string | null
  actions?: ReactNode
}

export const ApiKeyRow: FC<ApiKeyRowProps> = ({
  name,
  prefix,
  status,
  permissionLabel,
  permissionColor,
  projects,
  lastUsedAt,
  createdAt,
  expiresAt,
  actions,
}) => {
  return (
    <Box
      width="100%"
      p={4}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      transition="all 0.2s"
      _hover={{ borderColor: 'gray.300' }}
    >
      <Flex justify="space-between" align="center">
        <Flex flexDirection="column" gap={1} flex={1} minWidth={0}>
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="600" color="gray.700" truncate>
              {name}
            </Text>
            {status !== 'Active' && <ApiKeyStatusBadge status={status} />}
            <Badge variant="outline" colorPalette={permissionColor} size="sm">
              {permissionLabel}
            </Badge>
          </HStack>

          <HStack gap={2}>
            <Text fontSize="xs" fontFamily="mono" color="gray.400">
              {prefix}
            </Text>
            {projects.length > 0 && (
              <HStack gap={1}>
                {projects.map((p) => (
                  <Badge key={p.id} variant="outline" colorPalette="gray" size="sm">
                    {p.name}
                  </Badge>
                ))}
              </HStack>
            )}
            {projects.length === 0 && (
              <Badge variant="outline" colorPalette="gray" size="sm">
                All projects
              </Badge>
            )}
          </HStack>

          <HStack gap={4} mt={1} flexWrap="wrap">
            <Text fontSize="xs" color="gray.500">
              Created {formatDate(createdAt)}
            </Text>
            {expiresAt && (
              <Text fontSize="xs" color="gray.500">
                Expires {formatDate(expiresAt)}
              </Text>
            )}
            <Text fontSize="xs" color="gray.500">
              {lastUsedAt ? `Last used ${formatRelativeTime(lastUsedAt)}` : 'Never used'}
            </Text>
          </HStack>
        </Flex>

        {actions && <HStack gap={1}>{actions}</HStack>}
      </Flex>
    </Box>
  )
}
