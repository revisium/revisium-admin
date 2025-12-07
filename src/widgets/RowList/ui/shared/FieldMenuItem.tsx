import { Box, Menu, Text } from '@chakra-ui/react'
import { FC, memo } from 'react'
import { getFieldTypeIcon } from 'src/widgets/RowList/lib/getFieldTypeIcon'
import { FilterFieldType } from 'src/widgets/RowList/model/filterTypes'

interface FieldMenuItemProps {
  nodeId: string
  name: string
  fieldType: FilterFieldType | null
  valuePrefix?: string
  onClick: (nodeId: string) => void
}

export const FieldMenuItem: FC<FieldMenuItemProps> = memo(({ nodeId, name, fieldType, valuePrefix, onClick }) => {
  const handleClick = () => onClick(nodeId)

  return (
    <Menu.Item key={nodeId} value={valuePrefix ? `${valuePrefix}-${nodeId}` : nodeId} onClick={handleClick}>
      <Box display="flex" alignItems="center" gap={2} width="100%">
        {fieldType && (
          <Box as="span" fontSize="xs" fontWeight="medium" color="gray.400" fontFamily="mono" minWidth="20px">
            {getFieldTypeIcon(fieldType)}
          </Box>
        )}
        <Text truncate>{name || '(unnamed)'}</Text>
      </Box>
    </Menu.Item>
  )
})

FieldMenuItem.displayName = 'FieldMenuItem'
