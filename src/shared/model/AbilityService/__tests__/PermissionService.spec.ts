import { PermissionService } from '../PermissionService'
import { PermissionRule } from '../types'

const createPermission = (
  id: string,
  action: string,
  subject: string,
  condition?: Record<string, unknown> | null,
): PermissionRule => ({
  id,
  action,
  subject,
  condition: condition ?? null,
})

describe('PermissionService', () => {
  let service: PermissionService

  beforeEach(() => {
    service = new PermissionService()
  })

  describe('system level permissions', () => {
    it('should add system permissions without scope conditions', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

      expect(service.can('read', 'User')).toBe(true)
      expect(service.can('update', 'User')).toBe(false)
    })

    it('should preserve attribute conditions from system permissions', () => {
      service.addSystemPermissions([createPermission('read-project-public', 'read', 'Project', { isPublic: true })])

      expect(service.can('read', 'Project', { isPublic: true })).toBe(true)
      expect(service.can('read', 'Project', { isPublic: false })).toBe(false)
    })

    it('system admin with both read-project-private and read-project-public can read any project', () => {
      service.addSystemPermissions([
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
      ])

      expect(service.can('read', 'Project', { isPublic: true })).toBe(true)
      expect(service.can('read', 'Project', { isPublic: false })).toBe(true)
    })

    it('should persist system permissions after adding organization/project permissions', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(service.can('read', 'User')).toBe(true)
    })

    it('should not add duplicate system permissions', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

      expect(service.hasScope({ type: 'system' })).toBe(true)
    })
  })

  describe('organization level permissions', () => {
    it('should add organization permissions with organizationId scope', () => {
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])

      expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('create', 'Row', { organizationId: 'org-2' })).toBe(false)
    })

    it('should NOT allow access without context when rule has conditions', () => {
      // Rules with conditions (organizationId) should NOT match when no context is provided
      // This prevents org/project-scoped permissions from granting global access
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])

      expect(service.can('create', 'Row')).toBe(false)
      expect(service.can('create', 'Row', {})).toBe(false)
      expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
    })

    it('should support multiple organizations', () => {
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])
      service.addOrganizationPermissions('org-2', [createPermission('delete-row', 'delete', 'Row')])

      expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('delete', 'Row', { organizationId: 'org-2' })).toBe(true)
      expect(service.can('create', 'Row', { organizationId: 'org-2' })).toBe(false)
      expect(service.can('delete', 'Row', { organizationId: 'org-1' })).toBe(false)
    })

    it('should combine attribute conditions with organizationId', () => {
      service.addOrganizationPermissions('org-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(service.can('read', 'Project', { organizationId: 'org-1', isPublic: false })).toBe(true)
      expect(service.can('read', 'Project', { organizationId: 'org-1', isPublic: true })).toBe(false)
      expect(service.can('read', 'Project', { organizationId: 'org-2', isPublic: false })).toBe(false)
    })

    it('should track loaded organization scopes', () => {
      expect(service.hasScope({ type: 'organization', organizationId: 'org-1' })).toBe(false)

      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])

      expect(service.hasScope({ type: 'organization', organizationId: 'org-1' })).toBe(true)
      expect(service.hasScope({ type: 'organization', organizationId: 'org-2' })).toBe(false)
    })

    it('should not reload already loaded organization permissions', () => {
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])
      service.addOrganizationPermissions('org-1', [createPermission('delete-row', 'delete', 'Row')])

      expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('delete', 'Row', { organizationId: 'org-1' })).toBe(false)
    })
  })

  describe('project level permissions', () => {
    it('should add project permissions with projectId scope', () => {
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('update', 'Row', { projectId: 'proj-2' })).toBe(false)
    })

    it('should support multiple projects', () => {
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])
      service.addProjectPermissions('proj-2', [createPermission('delete-row', 'delete', 'Row')])

      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('delete', 'Row', { projectId: 'proj-2' })).toBe(true)
      expect(service.can('update', 'Row', { projectId: 'proj-2' })).toBe(false)
      expect(service.can('delete', 'Row', { projectId: 'proj-1' })).toBe(false)
    })

    it('should combine attribute conditions with projectId', () => {
      service.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(service.can('read', 'Project', { projectId: 'proj-1', isPublic: false })).toBe(true)
      expect(service.can('read', 'Project', { projectId: 'proj-1', isPublic: true })).toBe(false)
      expect(service.can('read', 'Project', { projectId: 'proj-2', isPublic: false })).toBe(false)
    })

    it('should track loaded project scopes', () => {
      expect(service.hasScope({ type: 'project', projectId: 'proj-1' })).toBe(false)

      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(service.hasScope({ type: 'project', projectId: 'proj-1' })).toBe(true)
      expect(service.hasScope({ type: 'project', projectId: 'proj-2' })).toBe(false)
    })

    it('should not reload already loaded project permissions', () => {
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])
      service.addProjectPermissions('proj-1', [createPermission('delete-row', 'delete', 'Row')])

      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('delete', 'Row', { projectId: 'proj-1' })).toBe(false)
    })
  })

  describe('permission hierarchy', () => {
    it('system permission without scope grants access regardless of context', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

      expect(service.can('read', 'User')).toBe(true)
      expect(service.can('read', 'User', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('read', 'User', { projectId: 'proj-1' })).toBe(true)
    })

    it('organization permission applies to all projects in that org', () => {
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])

      expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('create', 'Row', { organizationId: 'org-1', projectId: 'proj-1' })).toBe(true)
      expect(service.can('create', 'Row', { organizationId: 'org-1', projectId: 'proj-2' })).toBe(true)
    })

    it('project permission applies only to that specific project', () => {
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('update', 'Row', { projectId: 'proj-2' })).toBe(false)
    })

    it('combined permissions from all levels work together', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])
      service.addOrganizationPermissions('org-1', [createPermission('create-project', 'create', 'Project')])
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(service.can('read', 'User')).toBe(true)
      expect(service.can('create', 'Project', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)

      expect(service.can('create', 'Project', { organizationId: 'org-2' })).toBe(false)
      expect(service.can('update', 'Row', { projectId: 'proj-2' })).toBe(false)
    })
  })

  describe('permission expansion', () => {
    it('should expand read-project-private to read permissions for related subjects', () => {
      service.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(service.can('read', 'Table', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Branch', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Revision', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Endpoint', { projectId: 'proj-1' })).toBe(true)

      expect(service.can('read', 'User', { projectId: 'proj-1' })).toBe(false)
    })

    it('should expand read-project-public to read permissions for related subjects', () => {
      service.addProjectPermissions('proj-1', [
        createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
      ])

      expect(service.can('read', 'Table', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Branch', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Revision', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'Endpoint', { projectId: 'proj-1' })).toBe(true)
    })

    it('should expand at organization level with organizationId scope', () => {
      service.addOrganizationPermissions('org-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(service.can('read', 'Table', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('read', 'Row', { organizationId: 'org-1' })).toBe(true)

      expect(service.can('read', 'Table', { organizationId: 'org-2' })).toBe(false)
    })

    it('should expand at system level without scope', () => {
      service.addSystemPermissions([createPermission('read-project-private', 'read', 'Project', { isPublic: false })])

      expect(service.can('read', 'Table')).toBe(true)
      expect(service.can('read', 'Row')).toBe(true)
      expect(service.can('read', 'Branch')).toBe(true)
    })
  })

  describe('cannot', () => {
    it('should return opposite of can', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

      expect(service.cannot('read', 'User')).toBe(false)
      expect(service.cannot('update', 'User')).toBe(true)
    })
  })

  describe('scoped permissions and global subjects (User, Organization)', () => {
    it('should NOT grant global read:User when added at project level', () => {
      // User test has read:User only at project level
      service.addProjectPermissions('proj-1', [createPermission('read-user', 'read', 'User')])

      // Global check (for admin panel) should fail
      expect(service.can('read', 'User')).toBe(false)
      expect(service.can('read', 'User', {})).toBe(false)

      // Check with projectId context should pass
      expect(service.can('read', 'User', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('read', 'User', { projectId: 'proj-2' })).toBe(false)
    })

    it('should NOT grant global read:User when added at organization level', () => {
      service.addOrganizationPermissions('org-1', [createPermission('read-user', 'read', 'User')])

      // Global check should fail
      expect(service.can('read', 'User')).toBe(false)

      // Check with organizationId context should pass
      expect(service.can('read', 'User', { organizationId: 'org-1' })).toBe(true)
      expect(service.can('read', 'User', { organizationId: 'org-2' })).toBe(false)
    })

    it('should grant global read:User when added at system level', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

      // Global check (for admin panel) should pass
      expect(service.can('read', 'User')).toBe(true)
      expect(service.can('read', 'User', {})).toBe(true)
    })

    it('should correctly combine system and project level User permissions', () => {
      // User has read:User at system level (admin)
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

      // And also some project permissions
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      // Global read:User should still work
      expect(service.can('read', 'User')).toBe(true)

      // Project-scoped permissions should work with context
      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
      expect(service.can('update', 'Row')).toBe(false)
    })

    it('should NOT leak project User permissions to global scope after entering project', () => {
      // System permissions for regular user (no read:User)
      service.addSystemPermissions([createPermission('read-project-public', 'read', 'Project', { isPublic: true })])

      // User enters project and gets read:User at project level
      service.addProjectPermissions('proj-1', [
        createPermission('read-user', 'read', 'User'),
        createPermission('update-row', 'update', 'Row'),
      ])

      // Global read:User should still be false (no admin access)
      expect(service.can('read', 'User')).toBe(false)

      // Within project context, read:User should work
      expect(service.can('read', 'User', { projectId: 'proj-1' })).toBe(true)
    })
  })

  describe('clearAll', () => {
    it('should clear all permissions and scopes', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])
      service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])
      service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      service.clearAll()

      expect(service.can('read', 'User')).toBe(false)
      expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(false)
      expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(false)

      expect(service.hasScope({ type: 'system' })).toBe(false)
      expect(service.hasScope({ type: 'organization', organizationId: 'org-1' })).toBe(false)
      expect(service.hasScope({ type: 'project', projectId: 'proj-1' })).toBe(false)
    })

    it('should allow adding permissions again after clear', () => {
      service.addSystemPermissions([createPermission('read-user', 'read', 'User')])
      service.clearAll()
      service.addSystemPermissions([createPermission('create-user', 'create', 'User')])

      expect(service.can('read', 'User')).toBe(false)
      expect(service.can('create', 'User')).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    describe('system admin flow', () => {
      it('system admin can access everything', () => {
        const systemAdminPermissions = [
          createPermission('read-user', 'read', 'User'),
          createPermission('create-user', 'create', 'User'),
          createPermission('update-user', 'update', 'User'),
          createPermission('delete-user', 'delete', 'User'),
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
          createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
          createPermission('create-project', 'create', 'Project'),
          createPermission('update-project', 'update', 'Project'),
          createPermission('delete-project', 'delete', 'Project'),
        ]

        service.addSystemPermissions(systemAdminPermissions)

        expect(service.can('read', 'User')).toBe(true)
        expect(service.can('read', 'Project', { isPublic: false })).toBe(true)
        expect(service.can('read', 'Project', { isPublic: true })).toBe(true)
        expect(service.can('create', 'Project')).toBe(true)

        expect(service.can('read', 'Project', { projectId: 'any', isPublic: false })).toBe(true)
      })
    })

    describe('regular user with organization role', () => {
      it('organization owner can manage all projects in org', () => {
        service.addSystemPermissions([
          createPermission('read-organization', 'read', 'Organization'),
          createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
        ])

        service.addOrganizationPermissions('org-1', [
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
          createPermission('create-project', 'create', 'Project'),
          createPermission('update-project', 'update', 'Project'),
          createPermission('delete-project', 'delete', 'Project'),
          createPermission('create-row', 'create', 'Row'),
          createPermission('update-row', 'update', 'Row'),
          createPermission('delete-row', 'delete', 'Row'),
        ])

        expect(service.can('read', 'Organization')).toBe(true)
        expect(service.can('read', 'Project', { organizationId: 'org-1', isPublic: false })).toBe(true)
        expect(service.can('create', 'Project', { organizationId: 'org-1' })).toBe(true)
        expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)

        expect(service.can('read', 'Project', { organizationId: 'org-2', isPublic: false })).toBe(false)
        expect(service.can('create', 'Project', { organizationId: 'org-2' })).toBe(false)
      })
    })

    describe('project-only member', () => {
      it('editor can only edit rows in specific project', () => {
        service.addSystemPermissions([
          createPermission('read-organization', 'read', 'Organization'),
          createPermission('read-project-public', 'read', 'Project', { isPublic: true }),
        ])

        service.addProjectPermissions('proj-1', [
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
          createPermission('create-row', 'create', 'Row'),
          createPermission('update-row', 'update', 'Row'),
          createPermission('delete-row', 'delete', 'Row'),
          createPermission('create-revision', 'create', 'Revision'),
        ])

        expect(service.can('read', 'Project', { projectId: 'proj-1', isPublic: false })).toBe(true)
        expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
        expect(service.can('create', 'Revision', { projectId: 'proj-1' })).toBe(true)

        expect(service.can('update', 'Row', { projectId: 'proj-2' })).toBe(false)
        expect(service.can('create', 'Table', { projectId: 'proj-1' })).toBe(false)
      })
    })

    describe('permission caching', () => {
      it('should cache permissions when switching between projects in same org', () => {
        service.addSystemPermissions([createPermission('read-user', 'read', 'User')])

        service.addOrganizationPermissions('org-1', [createPermission('create-row', 'create', 'Row')])

        service.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

        service.addProjectPermissions('proj-2', [createPermission('delete-row', 'delete', 'Row')])

        expect(service.can('read', 'User')).toBe(true)
        expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
        expect(service.can('update', 'Row', { projectId: 'proj-1' })).toBe(true)
        expect(service.can('delete', 'Row', { projectId: 'proj-2' })).toBe(true)

        expect(service.hasScope({ type: 'system' })).toBe(true)
        expect(service.hasScope({ type: 'organization', organizationId: 'org-1' })).toBe(true)
        expect(service.hasScope({ type: 'project', projectId: 'proj-1' })).toBe(true)
        expect(service.hasScope({ type: 'project', projectId: 'proj-2' })).toBe(true)
      })
    })

    describe('cross-organization access', () => {
      it('permissions from different orgs should be isolated', () => {
        service.addOrganizationPermissions('org-1', [
          createPermission('create-row', 'create', 'Row'),
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        ])

        service.addOrganizationPermissions('org-2', [
          createPermission('delete-row', 'delete', 'Row'),
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        ])

        expect(service.can('create', 'Row', { organizationId: 'org-1' })).toBe(true)
        expect(service.can('delete', 'Row', { organizationId: 'org-1' })).toBe(false)

        expect(service.can('delete', 'Row', { organizationId: 'org-2' })).toBe(true)
        expect(service.can('create', 'Row', { organizationId: 'org-2' })).toBe(false)
      })
    })
  })
})
