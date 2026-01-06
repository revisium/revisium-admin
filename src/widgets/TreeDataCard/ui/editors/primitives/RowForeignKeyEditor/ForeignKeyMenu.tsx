import { FC, ReactNode, useState, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { SearchForeignKey } from 'src/features/SearchForeignKey'
import { container } from 'src/shared/lib'
import { FocusPopover } from 'src/widgets/TreeDataCard/ui/components/FocusPopover.tsx'

interface ForeignKeyMenuProps {
  store: JsonStringValueStore
  children: ReactNode
  onChange: (value: string) => void
  disabled?: boolean
}

export const ForeignKeyMenu: FC<ForeignKeyMenuProps> = ({ store, children, onChange, disabled }) => {
  const projectContext = container.get(ProjectContext)
  const { onSelectForeignKey } = useRowEditorActions()

  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = useCallback(
    (value: string) => {
      onChange(value)
      setIsOpen(false)
    },
    [onChange],
  )

  return (
    <FocusPopover isOpen={isOpen} setIsOpen={setIsOpen} trigger={children} disabled={disabled}>
      <SearchForeignKey
        revisionId={projectContext.revision.id}
        tableId={store.foreignKey ?? ''}
        onChange={handleSelect}
        onCreateAndConnect={async () => {
          await onSelectForeignKey(store, true)
        }}
        onOpenTableSearch={async () => {
          await onSelectForeignKey(store)
        }}
      />
    </FocusPopover>
  )
}
