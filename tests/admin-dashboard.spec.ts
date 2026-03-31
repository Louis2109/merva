// tests/admin-dashboard.spec.ts
// STEP 2: Admin dashboard & shops overview

import { test, expect } from '@playwright/test'
import { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, login } from './helpers'

// These tests assume there is at least one boutique in the database.

test.describe('Admin Dashboard', () => {
  test('admin can see KPIs and navigation', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD)

    await page.goto(`${BASE_URL}/admin`)

    // Header
    await expect(page.getByText(/Admin Dashboard/i)).toBeVisible()
    await expect(page.getByText(ADMIN_EMAIL)).toBeVisible()

    // KPIs
    await expect(page.getByText(/Boutiques/i)).toBeVisible()
    await expect(page.getByText(/Utilisateurs/i)).toBeVisible()
    await expect(page.getByText(/Produits/i)).toBeVisible()

    // Alerts & moderation section (static content)
    await expect(page.getByText(/Alertes & Modération/i)).toBeVisible()
  })

  test('admin can open shops and users management', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.goto(`${BASE_URL}/admin`)

    // Boutiques card button
    const shopsButton = page.getByRole('button', { name: /voir .* boutiques/i })
    await expect(shopsButton).toBeVisible()
    await shopsButton.click()
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/admin/shops`))

    // Back to admin dashboard, then users
    await page.goto(`${BASE_URL}/admin`)
    const usersButton = page.getByRole('button', { name: /voir .* utilisateurs/i })
    await expect(usersButton).toBeVisible()
    await usersButton.click()
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/admin/users`))
  })
})
