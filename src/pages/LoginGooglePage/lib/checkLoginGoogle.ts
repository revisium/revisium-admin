import { LoaderFunction, redirect } from 'react-router-dom'
import { LoginGoogleViewModel } from 'src/pages/LoginGooglePage/model/LoginGoogleViewModel.ts'
import { container, getSafeRedirectUrl } from 'src/shared/lib'

export const checkLoginGoogle: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const code = searchParams.get('code')
  const redirectTo = getSafeRedirectUrl(searchParams.get('redirect'))

  if (!code) {
    throw new Error('Invalid code')
  }

  const model = container.get(LoginGoogleViewModel)
  await model.login(code, redirectTo)

  return redirect(redirectTo || '/')
}
