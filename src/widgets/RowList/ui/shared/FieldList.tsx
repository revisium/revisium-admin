import { FC, memo } from 'react'
import { AvailableField } from 'src/widgets/RowList/model/types'
import { FieldMenuItem } from './FieldMenuItem'
import { FileFieldSubmenu } from './FileFieldSubmenu'

interface FieldListProps {
  fields: AvailableField[]
  valuePrefix?: string
  onSelect: (nodeId: string) => void
  getAvailableFileChildren: (field: AvailableField) => AvailableField[]
  isColumnVisible: (nodeId: string) => boolean
}

export const FieldList: FC<FieldListProps> = memo(
  ({ fields, valuePrefix, onSelect, getAvailableFileChildren, isColumnVisible }) => {
    return (
      <>
        {fields.map((field) =>
          field.isFileObject && field.children ? (
            <FileFieldSubmenu
              key={field.nodeId}
              field={field}
              availableChildren={getAvailableFileChildren(field)}
              isSelfVisible={isColumnVisible(field.nodeId)}
              valuePrefix={valuePrefix}
              onSelect={onSelect}
            />
          ) : (
            <FieldMenuItem
              key={field.nodeId}
              nodeId={field.nodeId}
              name={field.name}
              fieldType={field.fieldType}
              valuePrefix={valuePrefix}
              onClick={onSelect}
            />
          ),
        )}
      </>
    )
  },
)
