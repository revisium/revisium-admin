export const getSafeRedirectUrl = (redirect: string | null | undefined): string | undefined => {
  if (!redirect) return undefined
  if (redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return undefined
}

export const parseOAuthStateRedirect = (state: string | null): string | null => {
  if (!state) return null
  try {
    const parsed = JSON.parse(state)
    const redirect = parsed?.redirect
    return typeof redirect === 'string' ? redirect : null
  } catch {
    return null
  }
}

export const buildOAuthState = (redirectAfterLogin?: string): string | undefined => {
  if (!redirectAfterLogin) return undefined
  return JSON.stringify({ redirect: redirectAfterLogin })
}

export const getRedirectFromSearchParams = (): string | undefined => {
  const params = new URLSearchParams(globalThis.location.search)
  return getSafeRedirectUrl(params.get('redirect'))
}

export const buildRedirectParam = (path: string): string => {
  const safePath = getSafeRedirectUrl(path)
  if (!safePath || safePath === '/') return ''
  return `?redirect=${encodeURIComponent(safePath)}`
}
