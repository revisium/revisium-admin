/* eslint-disable @typescript-eslint/no-explicit-any */

type Factory<T> = () => T

type Scope = 'singleton' | 'request'

interface Registration<T> {
  factory: Factory<T>
  scope: Scope
  instance?: T
}

class DIContainer {
  private readonly registrations = new Map<new (...args: any[]) => any, Registration<any>>()

  public register<T>(token: new (...args: any[]) => T, factory: Factory<T>, options: { scope: Scope }): void {
    this.registrations.set(token, {
      factory,
      scope: options.scope,
    })
  }

  public get<T>(token: new (...args: any[]) => T): T {
    const registration = this.registrations.get(token) as Registration<T>

    if (!registration) {
      throw new Error(`No provider found for ${token.name}`)
    }

    if (registration.scope === 'singleton') {
      registration.instance ??= registration.factory()
      return registration.instance
    }

    return registration.factory()
  }
}

export const container = new DIContainer()
