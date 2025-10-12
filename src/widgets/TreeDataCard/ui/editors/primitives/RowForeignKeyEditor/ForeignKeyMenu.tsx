import { FC, ReactNode, useState, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { SearchForeignKey } from 'src/features/SearchForeignKey'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { FocusPopover } from 'src/widgets/TreeDataCard/ui/components/FocusPopover.tsx'

interface ForeignKeyMenuProps {
  store: JsonStringValueStore
  children: ReactNode
  onChange: (value: string) => void
  disabled?: boolean
}

export const ForeignKeyMenu: FC<ForeignKeyMenuProps> = ({ store, children, onChange, disabled }) => {
  const projectPageModel = useProjectPageModel()
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
        revisionId={projectPageModel.revisionOrThrow.id}
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
