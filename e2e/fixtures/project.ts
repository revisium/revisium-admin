export function createProjectFixture(projectName: string, orgId: string = 'testuser') {
  return {
    data: {
      project: {
        id: projectName,
        name: projectName,
        isPublic: false,
        organizationId: orgId,
        rootBranch: {
          id: `branch-${projectName}-main`,
          name: 'main',
          draftRevision: { id: `draft-rev-${projectName}` },
          headRevision: { id: `head-rev-${projectName}` },
        },
      },
    },
  }
}

export function createBranchFixture(projectName: string) {
  return {
    data: {
      branch: {
        id: `branch-${projectName}-main`,
        name: 'main',
        draftRevision: { id: `draft-rev-${projectName}` },
        headRevision: { id: `head-rev-${projectName}` },
      },
    },
  }
}

export function createRevisionFixture(projectName: string, isDraft: boolean = true) {
  return {
    data: {
      revision: {
        id: isDraft ? `draft-rev-${projectName}` : `head-rev-${projectName}`,
        isHead: !isDraft,
        isDraft: isDraft,
      },
    },
  }
}
