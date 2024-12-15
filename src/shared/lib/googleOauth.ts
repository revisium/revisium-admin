import { LOGIN_GOOGLE_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'

export const googleRedirectUrl = () => `${window.location.origin}/${LOGIN_ROUTE}/${LOGIN_GOOGLE_ROUTE}`

export const googleOauth = (clientId: string) => {
  const REDIRECT_URI = googleRedirectUrl()
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`
}
