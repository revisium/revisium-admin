import { LoaderFunction, redirect } from 'react-router-dom'
import { LoginGithubViewModel } from 'src/pages/LoginGithubPage/model/LoginGithubViewModel.ts'
import { container, getSafeRedirectUrl } from 'src/shared/lib'

export const checkLoginGithub: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const code = searchParams.get('code')
  const redirectTo = getSafeRedirectUrl(searchParams.get('redirect'))

  if (!code) {
    throw new Error('Invalid code')
  }

  const model = container.get(LoginGithubViewModel)
  await model.login(code)

  return redirect(redirectTo || '/')
}
