import { test, expect } from "@playwright/test";

test.describe("인증 및 로그인 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("홈페이지에서 로그인 버튼이 표시되어야 함", async ({ page }) => {
    await test.step("로그인 버튼 확인", async () => {
      const loginButton = page.getByRole("button", { name: "로그인" });
      await expect(loginButton).toBeVisible();
    });
  });

  test("로그인 버튼 클릭 시 로그인 모달이 열려야 함", async ({ page }) => {
    await test.step("로그인 버튼 클릭", async () => {
      const loginButton = page.getByRole("button", { name: "로그인" });
      await loginButton.click();
    });

    await test.step("로그인 모달 확인", async () => {
      // Clerk 로그인 모달이 표시되는지 확인
      // Clerk는 iframe을 사용하므로 약간의 대기 시간 필요
      await page.waitForTimeout(1000);
      // Clerk 모달 내부의 요소 확인 (이메일 입력 필드 등)
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible({ timeout: 5000 });
    });
  });

  test("로그인하지 않은 상태에서 보호된 페이지 접근 시 리다이렉트", async ({
    page,
  }) => {
    await test.step("주문 내역 페이지 접근 시도", async () => {
      await page.goto("/orders");
    });

    await test.step("로그인 페이지로 리다이렉트 확인", async () => {
      // Clerk는 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
      await page.waitForURL(/.*sign-in.*/, { timeout: 5000 });
      expect(page.url()).toContain("sign-in");
    });
  });
});

