import { container } from 'src/shared/lib'

type Envs =
  | 'REACT_APP_SWAGGER_SERVER_URL'
  | 'REACT_APP_GRAPHQL_SERVER_URL'
  | 'REACT_APP_GRAPHQL_SERVER_PROTOCOL'
  | 'REACT_APP_GRAPHQL_SERVER_HOST'
  | 'REACT_APP_GRAPHQL_SERVER_PORT'
  | 'REACT_APP_CETRIFUGE_PROTOCOL'
  | 'REACT_APP_CETRIFUGE_HOST'
  | 'REACT_APP_CETRIFUGE_PORT'

export class EnvironmentService {
  constructor() {}

  public get(key: Envs): string | undefined {
    const windowValue = window.__env__?.[key]
    const processValue = import.meta.env[key]

    return windowValue || processValue
  }
}

container.register(EnvironmentService, () => new EnvironmentService(), { scope: 'singleton' })
