import { LOGIN_GOOGLE_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'

export const googleRedirectUrl = (redirectAfterLogin?: string) => {
  const base = `${window.location.origin}/${LOGIN_ROUTE}/${LOGIN_GOOGLE_ROUTE}`
  return redirectAfterLogin ? `${base}?redirect=${encodeURIComponent(redirectAfterLogin)}` : base
}

export const googleOauth = (clientId: string, redirectAfterLogin?: string) => {
  const REDIRECT_URI = googleRedirectUrl(redirectAfterLogin)
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile email`
  window.location.href = url
}
