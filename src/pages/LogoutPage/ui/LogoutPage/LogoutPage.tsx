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
    model.logout()
    navigate(`/${LOGIN_ROUTE}`)
  }, [model, navigate])

  return null
})
