import { Menu, MenuItemOption, MenuList, MenuOptionGroup, Portal, useDisclosure } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { getSchemaByMenuId, menuSchemaGroups } from 'src/features/SchemaEditor/lib/getSchemaOptions.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { SubMenu } from 'src/features/SchemaEditor/ui/SchemaEditor/SubMenu.tsx'

interface TypesMenuListProps {
  currentSchema: JsonSchema
  menuButton: React.ReactElement
  onSelect: (value: SchemaNode) => void
  dataTestId?: string
}

export const MenuTypes: React.FC<TypesMenuListProps> = observer(
  ({ currentSchema, menuButton, onSelect, dataTestId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleChangeTypeAddingNode = useCallback(
      (id: string | string[]) => {
        if (typeof id === 'string') {
          const schemaNode = getSchemaByMenuId(id, currentSchema)
          if (schemaNode) {
            onSelect(schemaNode)
            onClose()
          }
        }
      },
      [currentSchema, onClose, onSelect],
    )

    const handleSubmenuSelect = useCallback(
      (id: string) => {
        const schemaNode = getSchemaByMenuId(id, currentSchema)
        if (schemaNode) {
          onSelect(schemaNode)
          onClose()
        }
      },
      [currentSchema, onClose, onSelect],
    )

    return (
      <Menu isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        {menuButton}
        <Portal>
          <MenuList>
            {menuSchemaGroups.map((group) => {
              const hasOnlySubmenu = group.options.every((o) => o.type === 'submenu')

              return (
                <MenuOptionGroup
                  key={group.id}
                  value=""
                  title={hasOnlySubmenu ? undefined : group.label}
                  onChange={handleChangeTypeAddingNode}
                >
                  {group.options.map((option) =>
                    option.type === 'submenu' ? (
                      <SubMenu
                        key={option.id}
                        label={option.label}
                        options={option.items}
                        onSelect={handleSubmenuSelect}
                        onRequestClose={onClose}
                        dataTestIdPrefix={`${dataTestId}-menu-sub`}
                      />
                    ) : (
                      <MenuItemOption
                        key={option.id}
                        value={option.id}
                        data-testid={`${dataTestId}-menu-type-${option.id}`}
                      >
                        {option.label}
                      </MenuItemOption>
                    ),
                  )}
                </MenuOptionGroup>
              )
            })}
          </MenuList>
        </Portal>
      </Menu>
    )
  },
)
