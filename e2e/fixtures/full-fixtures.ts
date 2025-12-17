export { SystemSchemaIds } from '../../src/entities/Schema/config/consts'

export function createConfigurationResponse() {
  return {
    data: {
      configuration: {
        availableEmailSignUp: true,
        google: {
          available: false,
          clientId: null,
        },
        github: {
          available: false,
          clientId: null,
        },
        plugins: {
          file: true,
        },
      },
    },
  }
}

export function createFullBranchResponse(projectName: string) {
  const branchId = `branch-${projectName}-master`
  const headRevId = `head-rev-${projectName}`
  const draftRevId = `draft-rev-${projectName}`

  return {
    data: {
      branch: {
        __typename: 'BranchModel',
        id: branchId,
        createdAt: '2024-01-01T00:00:00Z',
        name: 'master',
        touched: true,
        projectId: projectName,
        parent: null,
        start: {
          __typename: 'RevisionModel',
          id: headRevId,
          createdAt: '2024-01-01T00:00:00Z',
          comment: '',
          child: { __typename: 'RevisionModel', id: draftRevId },
          childBranches: [],
          endpoints: [],
        },
        head: {
          __typename: 'RevisionModel',
          id: headRevId,
          createdAt: '2024-01-01T00:00:00Z',
          comment: '',
          parent: null,
          child: { __typename: 'RevisionModel', id: draftRevId },
          childBranches: [],
          endpoints: [],
        },
        draft: {
          __typename: 'RevisionModel',
          id: draftRevId,
          createdAt: '2024-01-01T00:00:00Z',
          comment: '',
          parent: { __typename: 'RevisionModel', id: headRevId },
          endpoints: [],
        },
      },
    },
  }
}

export function createFullProjectResponse(projectName: string, orgId: string = 'testuser') {
  const branchId = `branch-${projectName}-master`
  const headRevId = `head-rev-${projectName}`
  const draftRevId = `draft-rev-${projectName}`

  return {
    data: {
      project: {
        __typename: 'ProjectModel',
        id: projectName,
        organizationId: orgId,
        createdAt: '2024-01-01T00:00:00Z',
        name: projectName,
        isPublic: false,
        rootBranch: {
          __typename: 'BranchModel',
          id: branchId,
          createdAt: '2024-01-01T00:00:00Z',
          name: 'master',
          touched: true,
          projectId: projectName,
          parent: null,
          start: {
            __typename: 'RevisionModel',
            id: headRevId,
            createdAt: '2024-01-01T00:00:00Z',
            comment: '',
            child: { __typename: 'RevisionModel', id: draftRevId },
            childBranches: [],
            endpoints: [],
          },
          head: {
            __typename: 'RevisionModel',
            id: headRevId,
            createdAt: '2024-01-01T00:00:00Z',
            comment: '',
            parent: null,
            child: { __typename: 'RevisionModel', id: draftRevId },
            childBranches: [],
            endpoints: [],
          },
          draft: {
            __typename: 'RevisionModel',
            id: draftRevId,
            createdAt: '2024-01-01T00:00:00Z',
            comment: '',
            parent: { __typename: 'RevisionModel', id: headRevId },
            endpoints: [],
          },
        },
        userProject: {
          __typename: 'UserProjectModel',
          id: `user-project-${projectName}`,
          role: {
            __typename: 'ProjectRoleModel',
            id: 'projectAdmin',
            name: 'Admin',
            permissions: [
              { __typename: 'PermissionModel', id: 'p1', action: 'manage', subject: 'all', condition: null },
            ],
          },
        },
        organization: {
          __typename: 'OrganizationModel',
          id: orgId,
          userOrganization: {
            __typename: 'UserOrganizationModel',
            id: `user-org-${orgId}`,
            role: {
              __typename: 'OrganizationRoleModel',
              id: 'organizationAdmin',
              name: 'Admin',
              permissions: [
                { __typename: 'PermissionModel', id: 'p2', action: 'manage', subject: 'all', condition: null },
              ],
            },
          },
        },
      },
    },
  }
}

export function createFullTableResponse(tableId: string, schema?: object) {
  const defaultSchema = {
    type: 'object',
    properties: {
      name: { type: 'string', default: '' },
      age: { type: 'number', default: 0 },
      active: { type: 'boolean', default: false },
    },
    additionalProperties: false,
    required: ['active', 'age', 'name'],
  }

  return {
    data: {
      table: {
        __typename: 'TableModel',
        createdId: tableId,
        id: tableId,
        versionId: `${tableId}-v1`,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        readonly: false,
        count: 0,
        schema: schema || defaultSchema,
      },
    },
  }
}

export function createMeResponse(orgId: string = 'testuser') {
  return {
    data: {
      me: {
        id: orgId,
        username: orgId,
        email: `${orgId}@example.com`,
        organizationId: orgId,
        role: {
          id: 'systemAdmin',
          name: 'System Admin',
          permissions: [
            { id: 'sp1', action: 'manage', subject: 'all', condition: null },
            { id: 'sp2', action: 'read', subject: 'Project', condition: null },
            { id: 'sp3', action: 'create', subject: 'Project', condition: null },
            { id: 'sp4', action: 'update', subject: 'Project', condition: null },
            { id: 'sp5', action: 'delete', subject: 'Project', condition: null },
            { id: 'sp6', action: 'read', subject: 'Table', condition: null },
            { id: 'sp7', action: 'create', subject: 'Table', condition: null },
            { id: 'sp8', action: 'update', subject: 'Table', condition: null },
            { id: 'sp9', action: 'delete', subject: 'Table', condition: null },
            { id: 'sp10', action: 'read', subject: 'Row', condition: null },
            { id: 'sp11', action: 'create', subject: 'Row', condition: null },
            { id: 'sp12', action: 'update', subject: 'Row', condition: null },
            { id: 'sp13', action: 'delete', subject: 'Row', condition: null },
          ],
        },
      },
    },
  }
}

export function createRowsResponse(
  rows: Array<{
    id: string
    data: Record<string, unknown>
  }>,
  options: { hasNextPage?: boolean; endCursor?: string | null; totalCount?: number } = {},
) {
  return {
    data: {
      rows: {
        __typename: 'RowsConnection',
        totalCount: options.totalCount ?? rows.length,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: options.hasNextPage ?? false,
          hasPreviousPage: false,
          startCursor: rows.length > 0 ? 'cursor-1' : null,
          endCursor: options.endCursor ?? (rows.length > 0 ? `cursor-${rows.length}` : null),
        },
        edges: rows.map((row, index) => ({
          __typename: 'RowModelEdge',
          cursor: `cursor-${index + 1}`,
          node: {
            __typename: 'RowModel',
            id: row.id,
            versionId: `${row.id}-v1`,
            readonly: false,
            data: row.data,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            publishedAt: null,
            createdId: row.id,
          },
        })),
      },
    },
  }
}

export function createTableViewsResponse(tableId: string) {
  return {
    data: {
      table: {
        id: tableId,
        views: null,
      },
    },
  }
}

export function createMeProjectsResponse(projectName: string, orgId: string = 'testuser') {
  const project = createFullProjectResponse(projectName, orgId).data.project
  return {
    data: {
      meProjects: {
        totalCount: 1,
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
        edges: [
          {
            cursor: 'cursor-1',
            node: project,
          },
        ],
      },
    },
  }
}

export function createTablesResponse(tableId: string) {
  const table = createFullTableResponse(tableId).data.table
  return {
    data: {
      tables: {
        __typename: 'TablesConnection',
        totalCount: 1,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor-1',
          endCursor: 'cursor-1',
        },
        edges: [
          {
            __typename: 'TableModelEdge',
            cursor: 'cursor-1',
            node: table,
          },
        ],
      },
    },
  }
}

export const emptyRowsResponse = createRowsResponse([])

export function createSampleRows(count: number, startFrom: number = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${startFrom + i + 1}`,
    data: {
      name: `User ${startFrom + i + 1}`,
      age: 20 + startFrom + i,
      active: i % 2 === 0,
    },
  }))
}
