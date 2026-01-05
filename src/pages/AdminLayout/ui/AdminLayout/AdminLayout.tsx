import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Page } from 'src/shared/ui'
import { AdminSidebar } from '../AdminSidebar/AdminSidebar'

export const AdminLayout: FC = () => {
  return (
    <Page sidebar={<AdminSidebar />}>
      <Outlet />
    </Page>
  )
}
