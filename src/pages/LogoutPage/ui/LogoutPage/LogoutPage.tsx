import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoutViewModel } from 'src/pages/LogoutPage/model/LogoutViewModel.ts'
import { LOGIN_ROUTE } from 'src/shared/config/routes.ts'
import { useViewModel } from 'src/shared/lib'

export const LogoutPage: FC = observer(() => {
  const model = useViewModel(LogoutViewModel)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    void model.logout().finally(() => {
      if (!cancelled) {
        navigate(`/${LOGIN_ROUTE}`)
      }
    })
    return () => {
      cancelled = true
    }
  }, [model, navigate])

  return null
})
