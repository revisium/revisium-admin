import { AbilityService } from '../AbilityService'
import { PermissionContext, PermissionData, ProjectPermissionData, RoleData } from '../PermissionContext'

const createPermission = (id: string, action: string, subject: string, condition?: unknown): PermissionData => ({
  id,
  action,
  subject,
  condition,
})

const createRole = (name: string, permissions: PermissionData[]): RoleData => ({
  id: `role-${name}`,
  name,
  permissions,
})

const createProjectData = (overrides: Partial<ProjectPermissionData> = {}): ProjectPermissionData => ({
  isPublic: false,
  ...overrides,
})

describe('PermissionContext', () => {
  let abilityService: AbilityService
  let permissionContext: PermissionContext

  beforeEach(() => {
    abilityService = new AbilityService()
    permissionContext = new PermissionContext(abilityService)
  })

  describe('setProject', () => {
    it('should set isPublic from project data', () => {
      permissionContext.setProject(createProjectData({ isPublic: true }))
      expect(permissionContext.isPublic).toBe(true)

      permissionContext.setProject(createProjectData({ isPublic: false }))
      expect(permissionContext.isPublic).toBe(false)
    })

    it('should extract role name from userProject', () => {
      const role = createRole('Editor', [])
      permissionContext.setProject(
        createProjectData({
          userProject: { role },
        }),
      )
      expect(permissionContext.projectRoleName).toBe('Editor')
    })

    it('should extract role name from organization when no userProject', () => {
      const role = createRole('Organization Owner', [])
      permissionContext.setProject(
        createProjectData({
          organization: {
            userOrganization: { role },
          },
        }),
      )
      expect(permissionContext.projectRoleName).toBe('Organization Owner')
    })

    it('should prefer userProject role over organization role', () => {
      const projectRole = createRole('Project Editor', [])
      const orgRole = createRole('Organization Owner', [])
      permissionContext.setProject(
        createProjectData({
          userProject: { role: projectRole },
          organization: {
            userOrganization: { role: orgRole },
          },
        }),
      )
      expect(permissionContext.projectRoleName).toBe('Project Editor')
    })

    it('should return null when no role is present', () => {
      permissionContext.setProject(createProjectData())
      expect(permissionContext.projectRoleName).toBeNull()
    })
  })

  describe('clearProject', () => {
    it('should reset isPublic and projectRoleName', () => {
      const role = createRole('Editor', [createPermission('update-row', 'update', 'Row')])
      permissionContext.setProject(
        createProjectData({
          isPublic: true,
          userProject: { role },
        }),
      )

      expect(permissionContext.isPublic).toBe(true)
      expect(permissionContext.projectRoleName).toBe('Editor')
      expect(permissionContext.canUpdateRow).toBe(true)

      permissionContext.clearProject()

      expect(permissionContext.isPublic).toBe(false)
      expect(permissionContext.projectRoleName).toBeNull()
      expect(permissionContext.canUpdateRow).toBe(false)
    })
  })

  describe('permission expansion', () => {
    describe('read-project-private expansion', () => {
      it('should expand read-project-private to read permissions for Table, Row, Branch, Revision, Endpoint', () => {
        const role = createRole('Reader', [
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        ])
        permissionContext.setProject(
          createProjectData({
            isPublic: false,
            userProject: { role },
          }),
        )

        expect(permissionContext.can('read', 'Table')).toBe(true)
        expect(permissionContext.can('read', 'Row')).toBe(true)
        expect(permissionContext.can('read', 'Branch')).toBe(true)
        expect(permissionContext.can('read', 'Revision')).toBe(true)
        expect(permissionContext.can('read', 'Endpoint')).toBe(true)
      })

      it('should NOT expand read-project-private to read User permission', () => {
        const role = createRole('Reader', [
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        ])
        permissionContext.setProject(
          createProjectData({
            isPublic: false,
            userProject: { role },
          }),
        )

        expect(permissionContext.can('read', 'User')).toBe(false)
      })
    })

    describe('read-project-public expansion', () => {
      it('should expand read-project-public to read permissions for Table, Row, Branch, Revision, Endpoint', () => {
        const role = createRole('Reader', [
          createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
        ])
        permissionContext.setProject(
          createProjectData({
            isPublic: true,
            userProject: { role },
          }),
        )

        expect(permissionContext.can('read', 'Table')).toBe(true)
        expect(permissionContext.can('read', 'Row')).toBe(true)
        expect(permissionContext.can('read', 'Branch')).toBe(true)
        expect(permissionContext.can('read', 'Revision')).toBe(true)
        expect(permissionContext.can('read', 'Endpoint')).toBe(true)
      })
    })

    it('should not expand other permissions', () => {
      const role = createRole('Editor', [createPermission('update-row', 'update', 'Row')])
      permissionContext.setProject(
        createProjectData({
          userProject: { role },
        }),
      )

      expect(permissionContext.can('update', 'Row')).toBe(true)
      expect(permissionContext.can('read', 'Table')).toBe(false)
      expect(permissionContext.can('read', 'Row')).toBe(false)
    })

    it('should deduplicate expanded permissions', () => {
      const role = createRole('Reader', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
      ])
      permissionContext.setProject(
        createProjectData({
          userProject: { role },
        }),
      )

      const rules = abilityService.rules.filter((r) => r.action === 'read' && r.subject === 'Table')
      expect(rules.length).toBe(1)
    })
  })

  describe('permission merging from multiple sources', () => {
    it('should merge permissions from userRole, userProject, and organization', () => {
      const userRole = createRole('SystemUser', [createPermission('read-organization', 'read', 'Organization')])
      const projectRole = createRole('Editor', [createPermission('update-row', 'update', 'Row')])
      const orgRole = createRole('OrgOwner', [createPermission('delete-project', 'delete', 'Project')])

      permissionContext.setUserRole(userRole)
      permissionContext.setProject(
        createProjectData({
          userProject: { role: projectRole },
          organization: {
            userOrganization: { role: orgRole },
          },
        }),
      )

      expect(permissionContext.can('read', 'Organization')).toBe(true)
      expect(permissionContext.can('update', 'Row')).toBe(true)
      expect(permissionContext.can('delete', 'Project')).toBe(true)
    })

    it('should deduplicate permissions by id', () => {
      const permission = createPermission('read-project-private', 'read', 'Project', { isPublic: false })
      const userRole = createRole('User', [permission])
      const projectRole = createRole('Reader', [permission])
      const orgRole = createRole('OrgMember', [permission])

      permissionContext.setUserRole(userRole)
      permissionContext.setProject(
        createProjectData({
          userProject: { role: projectRole },
          organization: {
            userOrganization: { role: orgRole },
          },
        }),
      )

      const projectRules = abilityService.rules.filter((r) => r.action === 'read' && r.subject === 'Project')
      expect(projectRules.length).toBe(1)
    })
  })

  describe('convenience getters', () => {
    describe('project permissions', () => {
      it('canReadProject should check read permission with isPublic condition', () => {
        const role = createRole('Reader', [
          createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
        ])
        permissionContext.setProject(
          createProjectData({
            isPublic: true,
            userProject: { role },
          }),
        )

        expect(permissionContext.canReadProject).toBe(true)
      })

      it('canUpdateProject should check update permission', () => {
        const role = createRole('Admin', [createPermission('update-project', 'update', 'Project')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canUpdateProject).toBe(true)
      })

      it('canDeleteProject should check delete permission', () => {
        const role = createRole('Admin', [createPermission('delete-project', 'delete', 'Project')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canDeleteProject).toBe(true)
      })

      it('canCreateProject should check create permission', () => {
        const role = createRole('Admin', [createPermission('create-project', 'create', 'Project')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateProject).toBe(true)
      })
    })

    describe('branch permissions', () => {
      it('canCreateBranch should check create permission', () => {
        const role = createRole('Developer', [createPermission('create-branch', 'create', 'Branch')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateBranch).toBe(true)
      })

      it('canDeleteBranch should check delete permission', () => {
        const role = createRole('Developer', [createPermission('delete-branch', 'delete', 'Branch')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canDeleteBranch).toBe(true)
      })
    })

    describe('revision permissions', () => {
      it('canCreateRevision should check create permission', () => {
        const role = createRole('Editor', [createPermission('create-revision', 'create', 'Revision')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateRevision).toBe(true)
      })

      it('canRevertRevision should check revert permission', () => {
        const role = createRole('Editor', [createPermission('revert-revision', 'revert', 'Revision')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canRevertRevision).toBe(true)
      })
    })

    describe('table permissions', () => {
      it('canCreateTable should check create permission', () => {
        const role = createRole('Developer', [createPermission('create-table', 'create', 'Table')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateTable).toBe(true)
      })

      it('canUpdateTable should check update permission', () => {
        const role = createRole('Developer', [createPermission('update-table', 'update', 'Table')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canUpdateTable).toBe(true)
      })

      it('canDeleteTable should check delete permission', () => {
        const role = createRole('Developer', [createPermission('delete-table', 'delete', 'Table')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canDeleteTable).toBe(true)
      })
    })

    describe('row permissions', () => {
      it('canCreateRow should check create permission', () => {
        const role = createRole('Editor', [createPermission('create-row', 'create', 'Row')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateRow).toBe(true)
      })

      it('canUpdateRow should check update permission', () => {
        const role = createRole('Editor', [createPermission('update-row', 'update', 'Row')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canUpdateRow).toBe(true)
      })

      it('canDeleteRow should check delete permission', () => {
        const role = createRole('Editor', [createPermission('delete-row', 'delete', 'Row')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canDeleteRow).toBe(true)
      })
    })

    describe('endpoint permissions', () => {
      it('canCreateEndpoint should check create permission', () => {
        const role = createRole('Developer', [createPermission('create-endpoint', 'create', 'Endpoint')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateEndpoint).toBe(true)
      })

      it('canDeleteEndpoint should check delete permission', () => {
        const role = createRole('Developer', [createPermission('delete-endpoint', 'delete', 'Endpoint')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canDeleteEndpoint).toBe(true)
      })
    })

    describe('user permissions', () => {
      it('canAddUser should check add permission', () => {
        const role = createRole('Admin', [createPermission('add-user', 'add', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canAddUser).toBe(true)
      })

      it('canUpdateUser should check update permission', () => {
        const role = createRole('Admin', [createPermission('update-user', 'update', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canUpdateUser).toBe(true)
      })

      it('canDeleteUser should check delete permission', () => {
        const role = createRole('Admin', [createPermission('delete-user', 'delete', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canDeleteUser).toBe(true)
      })

      it('canCreateUser should check create permission', () => {
        const role = createRole('Admin', [createPermission('create-user', 'create', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canCreateUser).toBe(true)
      })

      it('canReadUser should check read permission', () => {
        const role = createRole('Reader', [createPermission('read-user', 'read', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canReadUser).toBe(true)
      })
    })

    describe('composite permissions', () => {
      it('canManageUsers should be true if canAddUser', () => {
        const role = createRole('Admin', [createPermission('add-user', 'add', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canManageUsers).toBe(true)
      })

      it('canManageUsers should be true if canReadUser', () => {
        const role = createRole('Reader', [createPermission('read-user', 'read', 'User')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canManageUsers).toBe(true)
      })

      it('canManageUsers should be false if no user permissions', () => {
        const role = createRole('Editor', [createPermission('update-row', 'update', 'Row')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canManageUsers).toBe(false)
      })

      it('canAccessSettings should be true if canUpdateProject', () => {
        const role = createRole('Admin', [createPermission('update-project', 'update', 'Project')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canAccessSettings).toBe(true)
      })

      it('canAccessSettings should be true if canDeleteProject', () => {
        const role = createRole('Admin', [createPermission('delete-project', 'delete', 'Project')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canAccessSettings).toBe(true)
      })

      it('canAccessSettings should be false if no project management permissions', () => {
        const role = createRole('Editor', [createPermission('update-row', 'update', 'Row')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canAccessSettings).toBe(false)
      })

      it('canWrite should be true if can modify tables or rows', () => {
        const role = createRole('Editor', [createPermission('create-row', 'create', 'Row')])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canWrite).toBe(true)
        expect(permissionContext.isReadOnly).toBe(false)
      })

      it('isReadOnly should be true if cannot write', () => {
        const role = createRole('Reader', [
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        ])
        permissionContext.setProject(
          createProjectData({
            userProject: { role },
          }),
        )

        expect(permissionContext.canWrite).toBe(false)
        expect(permissionContext.isReadOnly).toBe(true)
      })
    })
  })

  describe('role-based scenarios', () => {
    const readerPermissions: PermissionData[] = [
      createPermission('read-organization', 'read', 'Organization'),
      createPermission('read-user', 'read', 'User'),
      createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
    ]

    const editorPermissions: PermissionData[] = [
      ...readerPermissions,
      createPermission('create-revision', 'create', 'Revision'),
      createPermission('revert-revision', 'revert', 'Revision'),
      createPermission('create-row', 'create', 'Row'),
      createPermission('update-row', 'update', 'Row'),
      createPermission('delete-row', 'delete', 'Row'),
    ]

    const developerPermissions: PermissionData[] = [
      ...editorPermissions,
      createPermission('create-branch', 'create', 'Branch'),
      createPermission('delete-branch', 'delete', 'Branch'),
      createPermission('create-table', 'create', 'Table'),
      createPermission('update-table', 'update', 'Table'),
      createPermission('delete-table', 'delete', 'Table'),
      createPermission('create-endpoint', 'create', 'Endpoint'),
      createPermission('delete-endpoint', 'delete', 'Endpoint'),
    ]

    it('Reader role should have read-only access', () => {
      const role = createRole('Reader', readerPermissions)
      permissionContext.setProject(
        createProjectData({
          isPublic: false,
          userProject: { role },
        }),
      )

      expect(permissionContext.canReadProject).toBe(true)
      expect(permissionContext.canReadUser).toBe(true)
      expect(permissionContext.can('read', 'Table')).toBe(true)
      expect(permissionContext.can('read', 'Row')).toBe(true)
      expect(permissionContext.can('read', 'Branch')).toBe(true)
      expect(permissionContext.can('read', 'Revision')).toBe(true)
      expect(permissionContext.can('read', 'Endpoint')).toBe(true)

      expect(permissionContext.canWrite).toBe(false)
      expect(permissionContext.isReadOnly).toBe(true)
      expect(permissionContext.canCreateRow).toBe(false)
      expect(permissionContext.canUpdateRow).toBe(false)
      expect(permissionContext.canDeleteRow).toBe(false)
    })

    it('Editor role should have row management access', () => {
      const role = createRole('Editor', editorPermissions)
      permissionContext.setProject(
        createProjectData({
          isPublic: false,
          userProject: { role },
        }),
      )

      expect(permissionContext.canCreateRow).toBe(true)
      expect(permissionContext.canUpdateRow).toBe(true)
      expect(permissionContext.canDeleteRow).toBe(true)
      expect(permissionContext.canCreateRevision).toBe(true)
      expect(permissionContext.canRevertRevision).toBe(true)

      expect(permissionContext.canCreateTable).toBe(false)
      expect(permissionContext.canUpdateTable).toBe(false)
      expect(permissionContext.canDeleteTable).toBe(false)
      expect(permissionContext.canCreateBranch).toBe(false)
      expect(permissionContext.canDeleteBranch).toBe(false)
    })

    it('Developer role should have full table and branch management', () => {
      const role = createRole('Developer', developerPermissions)
      permissionContext.setProject(
        createProjectData({
          isPublic: false,
          userProject: { role },
        }),
      )

      expect(permissionContext.canCreateTable).toBe(true)
      expect(permissionContext.canUpdateTable).toBe(true)
      expect(permissionContext.canDeleteTable).toBe(true)
      expect(permissionContext.canCreateBranch).toBe(true)
      expect(permissionContext.canDeleteBranch).toBe(true)
      expect(permissionContext.canCreateEndpoint).toBe(true)
      expect(permissionContext.canDeleteEndpoint).toBe(true)
    })
  })
})
