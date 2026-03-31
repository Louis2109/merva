// tests/merchant-dashboard.spec.ts
// STEP 3: Merchant dashboard + settings + limits

import { test, expect } from '@playwright/test'
import { BASE_URL, MERCHANT_EMAIL, MERCHANT_PASSWORD, login, expectDashboardLoaded } from './helpers'

// These tests assume MERCHANT_EMAIL/MERCHANT_PASSWORD correspond to
// a user who already has a shop created.

test.describe('Merchant Dashboard', () => {
  test('merchant sees clean dashboard layout', async ({ page }) => {
    await login(page, MERCHANT_EMAIL, MERCHANT_PASSWORD)
    await expectDashboardLoaded(page)

    // Header welcome + avatar
    await expect(page.getByText(/Bienvenue, /i)).toBeVisible()

    // Plan banner
    await expect(page.getByText(/Plan actuel/i)).toBeVisible()

    // Action cards
    await expect(page.getByText(/Mes Produits/i)).toBeVisible()
    await expect(page.getByText(/Paramètres/i)).toBeVisible()

    // Tips section
    await expect(page.getByText(/Astuces Mervason/i)).toBeVisible()
  })

  test('merchant can navigate to products and settings', async ({ page }) => {
    await login(page, MERCHANT_EMAIL, MERCHANT_PASSWORD)
    await expectDashboardLoaded(page)

    // Mes Produits → /dashboard/products
    const productsButton = page.getByRole('button', { name: /voir tout/i })
    await productsButton.click()
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/dashboard/products`))

    // Back to dashboard
    await page.goto(`${BASE_URL}/dashboard`)

    // Paramètres → /dashboard/settings
    const settingsButton = page.getByRole('button', { name: /modifier ma boutique|modifier/i })
    await settingsButton.click()
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/dashboard/settings`))
  })

  test('settings page shows shop form and plan sidebar', async ({ page }) => {
    await login(page, MERCHANT_EMAIL, MERCHANT_PASSWORD)
    await page.goto(`${BASE_URL}/dashboard/settings`)

    // Header
    await expect(page.getByText(/Paramètres de la boutique/i)).toBeVisible()

    // Form fields
    await expect(page.getByLabel(/Nom de la boutique/i)).toBeVisible()
    await expect(page.getByLabel(/Numéro WhatsApp/i)).toBeVisible()

    // Plan sidebar summary
    await expect(page.getByText(/Votre plan/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /voir les plans|augmenter ma limite/i })).toBeVisible()
  })
})
