import React from 'react'

interface TableProps {
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const TableComponent: React.FC<TableProps> = ({ style, children, ...props }) => (
  <table
    {...props}
    style={{
      ...style,
      width: 'max-content',
      minWidth: '100%',
      tableLayout: 'fixed',
    }}
  >
    {children}
  </table>
)
