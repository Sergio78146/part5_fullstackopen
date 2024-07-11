const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('form', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('/api/testing/reset');
      await request.post('/api/users', {
        data: {
          username: 'testuser',
          name: 'Test User',
          password: 'password123',
        },
      });
    });

    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'password123');
      await page.click('text=login');

      await expect(page.getByText('testuser logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'wrongpassword');
      await page.click('text=login');

      await expect(page.getByText('wrong username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'password123');
      await page.click('text=login');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[name="Title"]', 'New Blog Title');
      await page.fill('input[name="Author"]', 'New Blog Author');
      await page.fill('input[name="URL"]', 'http://newblog.com');
      await page.click('text=create');

      await expect(page.getByText('New Blog Title')).toBeVisible();
    });

    test('a blog can be edited', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[name="Title"]', 'New Blog Title');
      await page.fill('input[name="Author"]', 'New Blog Author');
      await page.fill('input[name="URL"]', 'http://newblog.com');
      await page.click('text=create');

      await page.click('text=view');
      await page.click('text=like');

      await expect(page.getByText('likes 1')).toBeVisible();
    });

    test('a blog can be deleted', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[name="Title"]', 'New Blog Title');
      await page.fill('input[name="Author"]', 'New Blog Author');
      await page.fill('input[name="URL"]', 'http://newblog.com');
      await page.click('text=create');

      await page.click('text=view');
      await page.click('text=remove');

      await expect(page.getByText('New Blog Title')).not.toBeVisible();
    });

    test('only the creator can see the delete button', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[name="Title"]', 'New Blog Title');
      await page.fill('input[name="Author"]', 'New Blog Author');
      await page.fill('input[name="URL"]', 'http://newblog.com');
      await page.click('text=create');

      await expect(page.getByText('remove')).toBeVisible();

      // Log out and log in as another user
      await page.click('text=logout');
      await request.post('/api/users', {
        data: {
          username: 'anotheruser',
          name: 'Another User',
          password: 'password123',
        },
      });
      await page.fill('input[name="Username"]', 'anotheruser');
      await page.fill('input[name="Password"]', 'password123');
      await page.click('text=login');

      await page.click('text=view');
      await expect(page.getByText('remove')).not.toBeVisible();
    });

    test('blogs are sorted by likes', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[name="Title"]', 'Blog 1');
      await page.fill('input[name="Author"]', 'Author 1');
      await page.fill('input[name="URL"]', 'http://blog1.com');
      await page.click('text=create');

      await page.click('text=create new blog');
      await page.fill('input[name="Title"]', 'Blog 2');
      await page.fill('input[name="Author"]', 'Author 2');
      await page.fill('input[name="URL"]', 'http://blog2.com');
      await page.click('text=create');

      await page.click('text=view', { nth: 0 });
      await page.click('text=like');
      await page.click('text=like');

      await page.click('text=view', { nth: 1 });
      await page.click('text=like');

      const blogs = await page.$$eval('.blog', blogs => blogs.map(blog => blog.innerText));
      expect(blogs[0]).toContain('Blog 1');
      expect(blogs[1]).toContain('Blog 2');
    });
  });
});
