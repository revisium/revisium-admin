type ENVS =
  | 'REACT_APP_GRAPHQL_SERVER_URL'
  | 'REACT_APP_SWAGGER_SERVER_URL'
  | 'REACT_APP_GRAPHQL_SERVER_PORT'
  | 'REACT_APP_ENDPOINT_SERVER_URL'
  | 'REACT_APP_ENDPOINT_HOST'
  | 'REACT_APP_ENDPOINT_PORT'
  | 'PACKAGE_VERSION'
  | 'GIT_COMMIT_HASH'
  | 'GIT_BRANCH_NAME'

export const getEnv = (value: ENVS) => {
  const metaEnv = import.meta.env[value]
  const runtimeEnv = window.__env__?.[value]

  return runtimeEnv || metaEnv
}
