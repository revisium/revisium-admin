export class ApiService {
  public client = {}
}

export class AuthService {}

export class EnvironmentService {
  public get(): string | undefined {
    return undefined
  }
}

export const client = {
  getBranchRevisions: jest.fn(),
}
