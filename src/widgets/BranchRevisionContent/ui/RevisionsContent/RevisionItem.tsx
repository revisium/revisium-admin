import { Box, Flex, Text, Badge } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'src/shared/ui'
import { RevisionTreeNode } from 'src/widgets/BranchRevisionContent/model/RevisionTreeNode.ts'

interface RevisionItemProps {
  revision: RevisionTreeNode
  onSelect: (revisionId: string) => void
}

export const RevisionItem: FC<RevisionItemProps> = observer(({ revision, onSelect }) => {
  const handleClick = () => {
    onSelect(revision.id)
  }

  return (
    <Link to={revision.link} style={{ textDecoration: 'none', display: 'block' }} onClick={handleClick}>
      <Box
        width="100%"
        backgroundColor={revision.isActive ? 'newGray.100/50' : 'transparent'}
        _hover={{
          backgroundColor: 'newGray.100',
        }}
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <Flex alignItems="center" justifyContent="space-between" paddingY="2" paddingX="3" gap={3}>
          <Box width="50px" flexShrink={0}>
            {revision.badgeText ? (
              <Badge size="sm" colorPalette="gray">
                {revision.badgeText}
              </Badge>
            ) : (
              <Text color={revision.isActive ? 'newGray.600' : 'newGray.200'}>{revision.shortId}</Text>
            )}
          </Box>

          {revision.comment && (
            <Tooltip content={revision.comment} positioning={{ placement: 'top' }}>
              <Text
                color="gray.400"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                flex={1}
                minWidth={0}
              >
                {revision.comment}
              </Text>
            </Tooltip>
          )}

          {revision.formattedDate && (
            <Text width="100px" fontSize="xs" color="gray.500" flexShrink={0}>
              {revision.formattedDate}
            </Text>
          )}
        </Flex>
      </Box>
    </Link>
  )
})
