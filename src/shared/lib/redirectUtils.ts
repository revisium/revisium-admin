export const getSafeRedirectUrl = (redirect: string | null | undefined): string | undefined => {
  if (!redirect) return undefined
  if (redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return undefined
}

export const getRedirectFromSearchParams = (): string | undefined => {
  const params = new URLSearchParams(window.location.search)
  return getSafeRedirectUrl(params.get('redirect'))
}

export const buildRedirectParam = (path: string): string => {
  const safePath = getSafeRedirectUrl(path)
  if (!safePath || safePath === '/') return ''
  return `?redirect=${encodeURIComponent(safePath)}`
}
