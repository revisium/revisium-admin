import { LOGIN_GITHUB_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'

export const githubRedirectUrl = (redirectAfterLogin?: string) => {
  const base = `${window.location.origin}/${LOGIN_ROUTE}/${LOGIN_GITHUB_ROUTE}`
  return redirectAfterLogin ? `${base}?redirect=${encodeURIComponent(redirectAfterLogin)}` : base
}

export const githubOauth = (clientId: string, redirectAfterLogin?: string) => {
  const REDIRECT_URI = githubRedirectUrl(redirectAfterLogin)
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`
  window.location.href = url
}
