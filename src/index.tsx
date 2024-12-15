import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getEnv } from 'src/shared/env/getEnv.ts'

import { App } from './app'
import './index.module.scss'

declare global {
  interface Window {
    __env__: Record<string, string | number> | undefined
  }
}

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

const fullVersion = `ver: ${getEnv('PACKAGE_VERSION')} - ${getEnv('GIT_BRANCH_NAME')}:${getEnv('GIT_COMMIT_HASH')}`
console.info(fullVersion)

if (import.meta.env.DEV && import.meta.env.REACT_APP_REACTOTRON === 'true') {
  window.global ||= window
  import('src/shared/lib/reactotron.ts')
}
