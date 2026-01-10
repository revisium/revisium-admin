import { JsonSchema } from 'src/entities/Schema/types/schema.types.ts'

export interface TableWithSchema {
  id: string
  schema: JsonSchema
  count: number
}

export interface ForeignKeyInfo {
  fieldPath: string
  targetTableId: string
}

export interface TableNode {
  id: string
  fieldsCount: number
  rowsCount: number
  incomingEdges: RelationEdge[]
  outgoingEdges: RelationEdge[]
}

export interface RelationEdge {
  id: string
  sourceTableId: string
  targetTableId: string
  fieldPath: string
  curveOffset: number
}

export interface GraphData {
  nodes: TableNode[]
  edges: RelationEdge[]
}

export interface LayoutNode extends TableNode {
  x: number
  y: number
}

export interface LayoutData {
  nodes: LayoutNode[]
  edges: RelationEdge[]
}
