export type RowNode = {
  id: string
  versionId: string
  data: Record<string, unknown>
  readonly: boolean
  createdAt: string
  updatedAt: string | null
  publishedAt: string | null
  createdId: string
}

export function createRowNode(id: string, data: Record<string, unknown>, options: Partial<RowNode> = {}): RowNode {
  return {
    id,
    versionId: options.versionId || `${id}-v1`,
    data,
    readonly: options.readonly ?? false,
    createdAt: options.createdAt || '2024-01-01T00:00:00Z',
    updatedAt: options.updatedAt || null,
    publishedAt: options.publishedAt || null,
    createdId: options.createdId || id,
  }
}

export function createRowsResponse(
  rows: RowNode[],
  options: { hasNextPage?: boolean; endCursor?: string | null } = {},
) {
  return {
    data: {
      rows: {
        totalCount: rows.length,
        pageInfo: {
          hasNextPage: options.hasNextPage ?? false,
          endCursor: options.endCursor ?? null,
        },
        edges: rows.map((node) => ({ node })),
      },
    },
  }
}

export const emptyRowsResponse = createRowsResponse([])

export function createSampleRows(count: number): RowNode[] {
  return Array.from({ length: count }, (_, i) =>
    createRowNode(`row-${i + 1}`, {
      name: `User ${i + 1}`,
      age: 20 + i,
      active: i % 2 === 0,
    }),
  )
}
