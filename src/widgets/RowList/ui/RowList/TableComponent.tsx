import React from 'react'

interface TableProps {
  style?: React.CSSProperties
}

export const TableComponent: React.FC<TableProps> = ({ style, ...props }) => (
  <table
    {...props}
    style={{
      ...style,
      width: 'max-content',
      minWidth: '100%',
      tableLayout: 'fixed',
    }}
  />
)
