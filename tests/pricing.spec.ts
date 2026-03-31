// tests/pricing.spec.ts
// STEP 3: Pricing page behaviour for guest and merchant

import { test, expect } from '@playwright/test'
import { BASE_URL, MERCHANT_EMAIL, MERCHANT_PASSWORD, login } from './helpers'

// Guest behaviour

test.describe('Pricing page - guest', () => {
  test('guest sees three plans and FAQ', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`)

    await expect(page.getByText(/Gratuit/i)).toBeVisible()
    await expect(page.getByText(/Standard/i)).toBeVisible()
    await expect(page.getByText(/Premium/i)).toBeVisible()

    await expect(page.getByText(/Questions fréquentes/i)).toBeVisible()
  })
})

// Merchant behaviour

test.describe('Pricing page - merchant', () => {
  test('merchant sees current plan badge', async ({ page }) => {
    await login(page, MERCHANT_EMAIL, MERCHANT_PASSWORD)

    await page.goto(`${BASE_URL}/pricing`)

    // Current plan info text
    await expect(page.getByText(/Plan actuel:/i)).toBeVisible()

    // At least one card should contain "Plan actuel" or equivalent
    const currentPlanBadge = page.getByText(/Plan actuel/i)
    await expect(currentPlanBadge).toBeVisible()
  })
})
