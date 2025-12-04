import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import checker from 'vite-plugin-checker'
import packageJson from './package.json'
import { execSync } from 'child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString().trimEnd()
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trimEnd()

const ENV_DIR = '.env'
const ENV_PREFIX = 'REACT_APP_'

console.log(`http://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}`)

export default ({ mode }) => {
  const env = loadEnv(mode, ENV_DIR, ENV_PREFIX)
  process.env = { ...process.env, ...env }

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
    server: {
      proxy: {
        [process.env.REACT_APP_GRAPHQL_SERVER_URL]: {
          target: `http://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}`,
          changeOrigin: true,
        },
        [process.env.REACT_APP_SWAGGER_SERVER_URL]: {
          target: `http://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}`,
          changeOrigin: true,
        },
        [process.env.REACT_APP_ENDPOINT_SERVER_URL]: {
          target: `http://${process.env.REACT_APP_ENDPOINT_HOST}:${process.env.REACT_APP_ENDPOINT_PORT}`,
          changeOrigin: true,
        },
        '/mcp': {
          target: `http://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}`,
          changeOrigin: true,
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
