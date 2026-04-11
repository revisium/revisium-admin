import { LogoutViewModel } from 'src/pages/LogoutPage/model/LogoutViewModel.ts'
import { AuthService } from 'src/shared/model'
import { ProjectContext } from 'src/entities/Project'

jest.mock('src/shared/lib', () => ({
  container: {
    register: jest.fn(),
    get: jest.fn(),
  },
}))

jest.mock('src/shared/model', () => ({
  AuthService: jest.fn(),
}))

jest.mock('src/entities/Project', () => ({
  ProjectContext: jest.fn(),
}))

describe('LogoutViewModel', () => {
  describe('logout()', () => {
    it('returns a Promise that resolves only after authService.logout() resolves', async () => {
      // This is the regression test for the bug where LogoutPage.useEffect
      // called model.logout() without awaiting, then navigated to /login,
      // and checkGuest bounced the user to / because authService.user was
      // still set (the server fetch hadn't completed yet).
      let authLogoutResolved = false
      const authService = {
        logout: jest.fn(
          () =>
            new Promise<void>((resolve) => {
              setTimeout(() => {
                authLogoutResolved = true
                resolve()
              }, 20)
            }),
        ),
      } as unknown as AuthService
      const projectContext = {
        clear: jest.fn(),
      } as unknown as ProjectContext

      const vm = new LogoutViewModel(authService, projectContext)
      const promise = vm.logout()

      expect(promise).toBeInstanceOf(Promise)
      expect(authLogoutResolved).toBe(false)

      await promise

      expect(authLogoutResolved).toBe(true)
      expect(authService.logout).toHaveBeenCalledTimes(1)
      expect(projectContext.clear).toHaveBeenCalledTimes(1)
    })

    it('clears projectContext before the auth server call starts', async () => {
      const order: string[] = []
      const authService = {
        logout: jest.fn(async () => {
          order.push('auth.logout')
        }),
      } as unknown as AuthService
      const projectContext = {
        clear: jest.fn(() => {
          order.push('projectContext.clear')
        }),
      } as unknown as ProjectContext

      const vm = new LogoutViewModel(authService, projectContext)
      await vm.logout()

      expect(order).toEqual(['projectContext.clear', 'auth.logout'])
    })

    it('propagates errors from authService.logout()', async () => {
      const authService = {
        logout: jest.fn().mockRejectedValue(new Error('network down')),
      } as unknown as AuthService
      const projectContext = {
        clear: jest.fn(),
      } as unknown as ProjectContext

      const vm = new LogoutViewModel(authService, projectContext)
      await expect(vm.logout()).rejects.toThrow('network down')
      // Local state was still cleared before the failing remote call
      expect(projectContext.clear).toHaveBeenCalledTimes(1)
    })
  })
})
