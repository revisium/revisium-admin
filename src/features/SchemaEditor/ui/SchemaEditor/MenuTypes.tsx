import { Menu, MenuItemOption, MenuList, MenuOptionGroup, Portal } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { getSchemaByMenuId, menuSchemaGroups } from 'src/features/SchemaEditor/lib/getSchemaOptions.ts'

interface TypesMenuListProps {
  currentSchema: JsonSchema
  menuButton: React.ReactElement
  onSelect: (value: JsonSchema) => void
  dataTestId?: string
}

export const MenuTypes: React.FC<TypesMenuListProps> = observer(
  ({ currentSchema, menuButton, onSelect, dataTestId }) => {
    const handleChangeTypeAddingNode = useCallback(
      async (id: string | string[]) => {
        if (!Array.isArray(id)) {
          const schema = getSchemaByMenuId(id, currentSchema)

          if (schema) {
            onSelect(schema)
          }
        }
      },
      [currentSchema, onSelect],
    )

    return (
      <Menu>
        {menuButton}
        <Portal>
          <MenuList width="100px">
            {menuSchemaGroups.map((menuSchemaGroup) => (
              <MenuOptionGroup
                value=""
                key={menuSchemaGroup.id}
                title={menuSchemaGroup.label}
                onChange={handleChangeTypeAddingNode}
              >
                {menuSchemaGroup.options.map((option) => (
                  <MenuItemOption
                    data-testid={`${dataTestId}-menu-type-${option.id}`}
                    key={option.id}
                    value={option.id}
                  >
                    {option.label}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            ))}
          </MenuList>
        </Portal>
      </Menu>
    )
  },
)
