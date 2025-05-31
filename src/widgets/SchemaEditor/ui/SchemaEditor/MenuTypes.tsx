import { Portal, useDisclosure } from '@chakra-ui/react'
import { Menu } from '@chakra-ui/react/menu'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { getSchemaByMenuId, menuSchemaGroups } from 'src/widgets/SchemaEditor/lib/getSchemaOptions.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { SubMenu } from 'src/widgets/SchemaEditor/ui/SchemaEditor/SubMenu.tsx'

interface TypesMenuListProps {
  currentSchema: JsonSchema
  menuButton: React.ReactElement
  onSelect: (value: SchemaNode) => void
  dataTestId?: string
}

export const MenuTypes: React.FC<TypesMenuListProps> = observer(
  ({ currentSchema, menuButton, onSelect, dataTestId }) => {
    const { open, onOpen, onClose } = useDisclosure()

    const handleChangeTypeAddingNode = useCallback(
      (id: string | string[]) => {
        if (!Array.isArray(id)) {
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
      <Menu.Root open={open} onOpenChange={({ open }) => (open ? onOpen() : onClose())}>
        <Menu.Trigger asChild>{menuButton}</Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {menuSchemaGroups.map((group) => {
                const hasOnlySubmenu = group.options.every((o) => o.type === 'submenu')

                return (
                  <React.Fragment key={group.id}>
                    {!hasOnlySubmenu && group.label && (
                      <Menu.ItemGroup>
                        <Menu.ItemGroupLabel>{group.label}</Menu.ItemGroupLabel>
                      </Menu.ItemGroup>
                    )}
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
                        <Menu.Item
                          key={option.id}
                          value={option.id}
                          data-testid={`${dataTestId}-menu-type-${option.id}`}
                          onClick={() => handleChangeTypeAddingNode(option.id)}
                        >
                          {option.label}
                        </Menu.Item>
                      ),
                    )}
                    {group.addDividerAfter && <Menu.Separator />}
                  </React.Fragment>
                )
              })}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    )
  },
)
