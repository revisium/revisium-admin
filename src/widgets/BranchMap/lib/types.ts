export type EndpointType = 'GRAPHQL' | 'REST_API'

export type EndpointData = {
  id: string
  type: EndpointType
  revisionId: string
  createdAt: string
}

export type RevisionData = {
  id: string
  comment: string
  isDraft: boolean
  isHead: boolean
  isStart: boolean
  createdAt: string
  parentId: string | null
  hasEndpoints: boolean
  endpointTypes: EndpointType[]
  childBranchIds: string[]
  branchName?: string
}

export type RevisionNodeData = {
  revision: RevisionData
  isHighlighted: boolean
  isDimmed: boolean
}

export type EndpointNodeData = {
  endpoints: EndpointData[]
  revisionId: string
  isHighlighted: boolean
  isDimmed: boolean
}

export type RevisionMapEdge = {
  id: string
  sourceId: string
  targetId: string
  sourceHandle?: string
  targetHandle?: string
  type: 'revision' | 'branch' | 'endpoint-graphql' | 'endpoint-rest' | 'parent-to-branch'
  isHighlighted: boolean
}

export type ProjectGraphRevision = {
  id: string
  comment: string
  isDraft: boolean
  isHead: boolean
  isStart: boolean
  createdAt: string
  parentId: string | null
  endpoints: EndpointData[]
  childBranchIds: string[]
  childBranchNames: string[]
}

export type ProjectGraphBranch = {
  id: string
  name: string
  isRoot: boolean
  touched: boolean
  createdAt: string
  parentBranchId: string | null
  parentBranchName: string | null
  parentRevision: ProjectGraphRevision | null
  startRevision: ProjectGraphRevision
  headRevision: ProjectGraphRevision
  draftRevision: ProjectGraphRevision
  totalRevisionsCount: number
}

export type ProjectGraphData = {
  projectName: string
  branches: ProjectGraphBranch[]
}

export type CollapsedRevisionsNodeData = {
  branchId: string
  count: number
  fromRevisionId: string
  toRevisionId: string
  isHighlighted: boolean
  isDimmed: boolean
}

export type ProjectBranchNodeData = {
  branch: ProjectGraphBranch
  isHighlighted: boolean
  isDimmed: boolean
}

export type ProjectGraphNode = {
  id: string
  type: 'revision' | 'collapsed' | 'endpoint' | 'branch'
  x: number
  y: number
  data: RevisionNodeData | CollapsedRevisionsNodeData | EndpointNodeData | ProjectBranchNodeData
}

export type ProjectGraphEdge = {
  id: string
  sourceId: string
  targetId: string
  sourceHandle?: string
  targetHandle?: string
  type: 'branch' | 'revision' | 'endpoint-graphql' | 'endpoint-rest' | 'parent-to-branch'
  isHighlighted: boolean
}

export type ProjectGraphLayoutData = {
  nodes: ProjectGraphNode[]
  edges: ProjectGraphEdge[]
  width: number
  height: number
}
