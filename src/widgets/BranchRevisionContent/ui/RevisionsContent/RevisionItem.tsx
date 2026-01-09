import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'src/shared/ui'
import { RevisionTreeNode } from 'src/widgets/BranchRevisionContent/model/RevisionTreeNode.ts'

interface RevisionItemProps {
  model: RevisionTreeNode
}

export const RevisionItem: FC<RevisionItemProps> = observer(({ model }) => {
  return (
    <Box
      width="100%"
      backgroundColor={model.isActive ? 'newGray.100/50' : 'transparent'}
      _hover={{
        backgroundColor: 'newGray.100',
      }}
      borderBottom="1px solid"
      borderColor="border.subtle"
    >
      <Flex alignItems="center" justifyContent="space-between" paddingY="2" paddingX="3" gap={3}>
        <Link
          to={model.link}
          onClick={model.showNavigationToast}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}
        >
          <Box width="50px" flexShrink={0}>
            {model.badgeText ? (
              <Badge size="sm" colorPalette="gray">
                {model.badgeText}
              </Badge>
            ) : (
              <Text color={model.isActive ? 'newGray.600' : 'newGray.200'}>{model.shortId}</Text>
            )}
          </Box>

          {model.comment && (
            <Tooltip content={model.comment} positioning={{ placement: 'top' }}>
              <Text
                color="gray.400"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                flex={1}
                minWidth={0}
              >
                {model.comment}
              </Text>
            </Tooltip>
          )}

          {model.formattedDate && (
            <Text width="100px" fontSize="xs" color="gray.500" flexShrink={0}>
              {model.formattedDate}
            </Text>
          )}
        </Link>
      </Flex>
    </Box>
  )
})
