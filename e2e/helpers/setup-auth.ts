import { Page } from '@playwright/test'

export async function setupAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-jwt-token-for-testing')
  })
}

export const authFixtures = {
  me: {
    data: {
      me: {
        id: 'test-user',
        username: 'testuser',
        email: 'test@example.com',
      },
    },
  },
}
