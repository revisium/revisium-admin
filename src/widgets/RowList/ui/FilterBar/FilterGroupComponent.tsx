import { Box, Button, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuPlus, LuX } from 'react-icons/lu'
import { FilterModel } from 'src/widgets/RowList/model/FilterModel'
import { FilterGroup } from 'src/widgets/RowList/model/filterTypes'
import { FilterConditionRow } from './FilterConditionRow'
import { LogicSelect } from './LogicSelect'

interface FilterGroupComponentProps {
  filterModel: FilterModel
  group: FilterGroup
  isRoot?: boolean
}

export const FilterGroupComponent: FC<FilterGroupComponentProps> = observer(
  ({ filterModel, group, isRoot = false }) => {
    const handleLogicChange = (logic: 'and' | 'or') => {
      filterModel.setGroupLogic(group.id, logic)
    }

    const handleAddCondition = () => filterModel.addCondition(group.id)
    const handleAddGroup = () => filterModel.addGroup(group.id)
    const handleRemoveGroup = () => filterModel.removeGroup(group.id)

    const hasContent = group.conditions.length > 0 || group.groups.length > 0

    return (
      <Box
        borderWidth={isRoot ? 0 : 1}
        borderColor="newGray.100"
        borderRadius="md"
        p={isRoot ? 0 : 3}
        bg={isRoot ? 'transparent' : 'newGray.25'}
        position="relative"
      >
        {!isRoot && (
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Text fontSize="sm" color="newGray.500">
                Match
              </Text>
              <LogicSelect logic={group.logic} onChange={handleLogicChange} />
              <Text fontSize="sm" color="newGray.500">
                of the following
              </Text>
            </Box>
            <Button size="xs" variant="ghost" colorPalette="gray" onClick={handleRemoveGroup}>
              <LuX />
              Remove group
            </Button>
          </Box>
        )}

        {isRoot && hasContent && (
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Text fontSize="sm" color="newGray.500">
              Where
            </Text>
            <LogicSelect logic={group.logic} onChange={handleLogicChange} />
            <Text fontSize="sm" color="newGray.500">
              of the following are true
            </Text>
          </Box>
        )}

        {group.conditions.map((condition) => (
          <FilterConditionRow key={condition.id} filterModel={filterModel} condition={condition} />
        ))}

        {group.groups.map((nestedGroup) => (
          <Box key={nestedGroup.id} mt={2}>
            <FilterGroupComponent filterModel={filterModel} group={nestedGroup} />
          </Box>
        ))}

        <Box display="flex" gap={2} mt={2}>
          <Button
            size="xs"
            variant="ghost"
            onClick={handleAddCondition}
            disabled={filterModel.availableFields.length === 0}
          >
            <LuPlus />
            Add condition
          </Button>
          {isRoot && (
            <Button
              size="xs"
              variant="ghost"
              onClick={handleAddGroup}
              disabled={filterModel.availableFields.length === 0}
            >
              <LuPlus />
              Add group
            </Button>
          )}
        </Box>
      </Box>
    )
  },
)
