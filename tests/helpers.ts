// tests/helpers.ts
// Shared helpers & test users configuration

import { expect, Page } from '@playwright/test'

export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

export const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || 'nkenfackloic@outlook.com'
export const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'admin123'

// Merchant test user - change these to match a real merchant account in your DB
export const MERCHANT_EMAIL = process.env.PLAYWRIGHT_MERCHANT_EMAIL || 'nkenfacklandoloic@gmail.com'
export const MERCHANT_PASSWORD = process.env.PLAYWRIGHT_MERCHANT_PASSWORD || '123456'

export async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/auth/login`)

  await page.getByRole('textbox', { name: /email/i }).fill(email)
  await page.getByRole('textbox', { name: /mot de passe|password/i }).fill(password)
  // There are multiple buttons with names like "Connexion" in the layout
  // (navbar + form submit). Target explicitly the main submit button.
  await page.getByRole('button', { name: /se connecter/i }).click()
}

export async function expectDashboardLoaded(page: Page) {
  await expect(page).toHaveURL(new RegExp(`${BASE_URL}/dashboard`))
  await expect(page.getByText(/Bienvenue, /i)).toBeVisible()
}
