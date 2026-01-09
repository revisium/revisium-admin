import { LOGIN_GOOGLE_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'
import { buildOAuthState } from './redirectUtils.ts'

export const googleRedirectUrl = () => {
  return `${globalThis.location.origin}/${LOGIN_ROUTE}/${LOGIN_GOOGLE_ROUTE}`
}

export const googleOauth = (clientId: string, redirectAfterLogin?: string) => {
  const REDIRECT_URI = googleRedirectUrl()
  let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile email`

  const state = buildOAuthState(redirectAfterLogin)
  if (state) {
    url += `&state=${encodeURIComponent(state)}`
  }

  globalThis.location.href = url
}
