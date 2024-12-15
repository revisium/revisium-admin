import { LOGIN_GITHUB_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'

export const githubRedirectUrl = () => `${window.location.origin}/${LOGIN_ROUTE}/${LOGIN_GITHUB_ROUTE}`

export const githubOauth = (clientId: string) => {
  const REDIRECT_URI = githubRedirectUrl()
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&scope=user:email`
}
