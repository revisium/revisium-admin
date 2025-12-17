import { Page } from '@playwright/test'

export async function setupAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-jwt-token-for-testing')
  })
}
