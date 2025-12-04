import { LOGIN_GOOGLE_ROUTE, LOGIN_ROUTE } from 'src/shared/config/routes.ts'

export const googleRedirectUrl = () => {
  return `${window.location.origin}/${LOGIN_ROUTE}/${LOGIN_GOOGLE_ROUTE}`
}

export const googleOauth = (clientId: string, redirectAfterLogin?: string) => {
  const REDIRECT_URI = googleRedirectUrl()
  let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile email`

  // Use state parameter to pass redirect info (OAuth 2.0 compliant way)
  if (redirectAfterLogin) {
    const state = JSON.stringify({ redirect: redirectAfterLogin })
    url += `&state=${encodeURIComponent(state)}`
  }

  window.location.href = url
}
