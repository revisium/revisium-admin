export function convertSchemaPathToJsonPath(schemaPath: string): string {
  if (schemaPath === '') {
    return ''
  }

  const cleanPath = schemaPath.startsWith('/') ? schemaPath.slice(1) : schemaPath

  if (cleanPath === '') {
    return ''
  }

  const segments = cleanPath.split('/')
  let result = ''

  let i = 0
  while (i < segments.length) {
    const segment = segments[i]

    if (segment === 'properties') {
      i++
      if (i < segments.length) {
        const propertyName = segments[i]
        if (propertyName) {
          if (result) {
            result += '.'
          }
          result += propertyName
        }
      }
    } else if (segment === 'items') {
      result += '[*]'
    }

    i++
  }

  return result
}
