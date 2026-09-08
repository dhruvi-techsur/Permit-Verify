import { test, expect } from '@playwright/test';

/**
 * Full auth flow e2e tests.
 * Requires the backend + frontend to be running (docker compose up).
 * Uses seed users: applicant@permitflow.test / Test1234!
 */

const APPLICANT = { email: 'applicant@permitflow.test', password: 'Test1234!' };

test.describe('Complete auth flow (AUTH-01 through AUTH-05)', () => {
  // AUTH-02: Login + redirect to dashboard
  test('applicant can log in and reach dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill(APPLICANT.email);
    await page.getByLabel('Password').fill(APPLICANT.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  // AUTH-02: Dashboard shows applicant role in sidebar
  test('sidebar shows correct nav items for applicant role', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill(APPLICANT.email);
    await page.getByLabel('Password').fill(APPLICANT.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');

    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('My Applications')).toBeVisible();
    // Reviewer-only nav item NOT visible to applicant
    await expect(page.getByText('Review Queue')).not.toBeVisible();
  });

  // AUTH-05: RBAC — applicant cannot access reviewer route
  test('applicant redirected to dashboard when accessing reviewer route', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill(APPLICANT.email);
    await page.getByLabel('Password').fill(APPLICANT.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');

    await page.goto('/review/queue');
    await expect(page).toHaveURL('/dashboard');
  });

  // AUTH-03: Logout → /login, back button blocked
  test('logout clears session and redirects to login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill(APPLICANT.email);
    await page.getByLabel('Password').fill(APPLICANT.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Click logout in sidebar
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL('/login');

    // Back button should not re-access dashboard
    await page.goBack();
    await expect(page).toHaveURL('/login');
  });

  // AUTH-01: Registration flow
  test('new user can register and reach dashboard', async ({ page }) => {
    const uniqueEmail = `e2e-new-${Date.now()}@test.com`;

    await page.goto('/register');
    await page.getByLabel('Full name').fill('E2E Test User');
    await page.getByLabel('Work email address').fill(uniqueEmail);
    await page.getByLabel('Password').fill('Secure1234!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back, E2E')).toBeVisible();
  });

  // AUTH-03: Unauthenticated redirect
  test('unauthenticated user visiting /dashboard is redirected to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  // AUTH-04: Forgot password — success state (cannot verify full email flow in e2e)
  test('forgot password shows success state after submission', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel('Email address').fill(APPLICANT.email);
    await page.getByRole('button', { name: 'Send Reset Link' }).click();
    await expect(page.getByText('Check your email')).toBeVisible();
  });

  // Session persistence — refresh token restores session
  test('session persists across page reload', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill(APPLICANT.email);
    await page.getByLabel('Password').fill(APPLICANT.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Reload the page
    await page.reload();
    // Should still be on dashboard (refresh token restores session)
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});
