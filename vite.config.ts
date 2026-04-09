import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import checker from 'vite-plugin-checker'
import packageJson from './package.json'
import { execSync } from 'node:child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString().trimEnd()
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trimEnd()

const ENV_DIR = '.env'
const ENV_PREFIX = 'REACT_APP_'

export default function viteConfig({ mode }) {
  const env = loadEnv(mode, ENV_DIR, ENV_PREFIX)
  process.env = { ...process.env, ...env }

  const graphqlProtocol = process.env.REACT_APP_GRAPHQL_SERVER_PROTOCOL || 'http'
  const graphqlTarget = `${graphqlProtocol}://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}`
  const endpointProtocol = process.env.REACT_APP_ENDPOINT_PROTOCOL || graphqlProtocol
  const endpointTarget = `${endpointProtocol}://${process.env.REACT_APP_ENDPOINT_HOST}:${process.env.REACT_APP_ENDPOINT_PORT}`

  return defineConfig({
    plugins: [
      react(),
      checker({
        // e.g. use TypeScript check
        typescript: true,
      }),
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/')
            ) {
              return 'vendor-react'
            }
            if (
              id.includes('node_modules/mobx/') ||
              id.includes('node_modules/mobx-react-lite/') ||
              id.includes('node_modules/mobx-utils/')
            ) {
              return 'vendor-mobx'
            }
            if (id.includes('node_modules/@chakra-ui/react/') || id.includes('node_modules/@emotion/react/')) {
              return 'vendor-chakra'
            }
            if (id.includes('node_modules/graphql/') || id.includes('node_modules/graphql-request/')) {
              return 'vendor-graphql'
            }
          },
        },
      },
    },
    server: {
      proxy: {
        [process.env.REACT_APP_GRAPHQL_SERVER_URL]: {
          target: graphqlTarget,
          changeOrigin: true,
          secure: graphqlProtocol === 'https',
        },
        [process.env.REACT_APP_SWAGGER_SERVER_URL]: {
          target: graphqlTarget,
          changeOrigin: true,
          secure: graphqlProtocol === 'https',
        },
        [process.env.REACT_APP_ENDPOINT_SERVER_URL]: {
          target: endpointTarget,
          changeOrigin: true,
          secure: endpointProtocol === 'https',
        },
        '/mcp': {
          target: graphqlTarget,
          changeOrigin: true,
          secure: graphqlProtocol === 'https',
        },
        '/.well-known/oauth-authorization-server': {
          target: graphqlTarget,
          changeOrigin: true,
          secure: graphqlProtocol === 'https',
        },
        '/.well-known/oauth-protected-resource': {
          target: graphqlTarget,
          changeOrigin: true,
          secure: graphqlProtocol === 'https',
        },
        '/oauth': {
          target: graphqlTarget,
          changeOrigin: true,
          secure: graphqlProtocol === 'https',
        },
      },
    },
    envDir: ENV_DIR,
    envPrefix: ENV_PREFIX,
    define: {
      'import.meta.env.PACKAGE_VERSION': `${JSON.stringify(packageJson.version)}`,
      'import.meta.env.GIT_COMMIT_HASH': `"${commitHash}"`,
      'import.meta.env.GIT_BRANCH_NAME': `"${branchName}"`,
    },
  })
}
