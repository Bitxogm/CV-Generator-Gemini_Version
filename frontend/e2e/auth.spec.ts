import { test, expect } from '@playwright/test';

const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
};

const AUTH_RESPONSE = {
  success: true,
  data: {
    user: mockUser,
    token: 'mock-jwt-token',
  },
};

test.describe('Authentication Flow', () => {
  test('should register new user successfully', async ({ page }) => {
    // Un único handler para todo localhost:3000 — evita conflictos de prioridad
    await page.route('http://localhost:3000/**', async (route) => {
      if (route.request().url().includes('/auth/signup')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(AUTH_RESPONSE),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] }),
        });
      }
    });

    await page.goto('/register');
    await page.waitForSelector('input[name="username"]');

    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');

    await page.click('button[type="submit"]');

    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');
  });

  test('should login with existing user', async ({ page }) => {
    await page.route('http://localhost:3000/**', async (route) => {
      if (route.request().url().includes('/auth/signin')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(AUTH_RESPONSE),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] }),
        });
      }
    });

    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');

    await page.click('button[type="submit"]');

    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // 400 en lugar de 401 para evitar el interceptor que redirige a /login
    await page.route('http://localhost:3000/**', async (route) => {
      if (route.request().url().includes('/auth/signin')) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Credenciales invalidas' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] }),
        });
      }
    });

    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/login');

    // Sonner monta toasts en un portal — getByText los encuentra igualmente
    await expect(page.getByText('Error al iniciar sesión')).toBeVisible({ timeout: 5000 });
  });
});
