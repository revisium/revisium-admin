import { observer } from 'mobx-react-lite'
import { FC, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { RouterParams } from 'src/shared/model/RouterParams.ts'
import { Page } from 'src/shared/ui'
import { ProjectSidebarSkeleton } from 'src/widgets/ProjectSidebar/ui/ProjectSidebarSkeleton/ProjectSidebarSkeleton.tsx'

const SKELETON_DELAY_MS = 150

export const ProjectLayout: FC = observer(() => {
  const projectContext = container.get(ProjectContext)
  const routerParams = container.get(RouterParams)
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (!projectContext.isInitLoading) {
      setShowSkeleton(false)
      return
    }

    const timer = setTimeout(() => {
      setShowSkeleton(true)
    }, SKELETON_DELAY_MS)

    return () => clearTimeout(timer)
  }, [projectContext.isInitLoading])

  if (projectContext.isInitLoading) {
    if (!showSkeleton) {
      return null
    }

    return (
      <Page
        sidebar={
          <ProjectSidebarSkeleton
            projectName={routerParams.projectName ?? ''}
            organizationId={routerParams.organizationId ?? ''}
          />
        }
      />
    )
  }

  return <Outlet />
})
