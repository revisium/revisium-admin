import { LOGIN_GITHUB_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'
import { buildOAuthState } from './redirectUtils.ts'

export const githubRedirectUrl = () => {
  return `${window.location.origin}/${LOGIN_ROUTE}/${LOGIN_GITHUB_ROUTE}`
}

export const githubOauth = (clientId: string, redirectAfterLogin?: string) => {
  const REDIRECT_URI = githubRedirectUrl()
  let url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`

  const state = buildOAuthState(redirectAfterLogin)
  if (state) {
    url += `&state=${encodeURIComponent(state)}`
  }

  window.location.href = url
}
