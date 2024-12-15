import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'
import { useShowLoaderBar } from 'src/app/hooks/useShowLoaderBar.ts'

export const Layout: FC = () => {
  const ref = useShowLoaderBar(150)

  return (
    <>
      <LoadingBar ref={ref} color="#1fa3ff" height={1} waitingTime={500} />
      <Outlet />
    </>
  )
}
