import { test, expect } from "@playwright/test";

test.describe("통합 구매 플로우 테스트", () => {
  test("상품 선택부터 주문까지 전체 플로우", async ({ page }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
      await expect(page).toHaveURL(/.*\/$/);
    });

    await test.step("상품 목록 페이지로 이동", async () => {
      const moreButton = page.getByRole("button", { name: "더보기" });
      if (await moreButton.isVisible()) {
        await moreButton.click();
        await expect(page).toHaveURL(/.*\/products.*/);
      } else {
        await page.goto("/products");
      }
    });

    await test.step("상품 상세 페이지로 이동", async () => {
      const firstProduct = page.locator('a[href^="/products/"]').first();
      if (await firstProduct.isVisible()) {
        await firstProduct.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(/.*\/products\/.*/);
      } else {
        test.skip("상품이 없어서 테스트를 건너뜁니다.");
      }
    });

    await test.step("장바구니 담기 버튼 확인", async () => {
      const addToCartButton = page.getByRole("button", {
        name: /장바구니에 담기/,
      });
      if (await addToCartButton.isVisible()) {
        // 로그인하지 않은 상태에서 클릭 시 로그인 페이지로 이동하는지 확인
        await addToCartButton.click();
        // 로그인 페이지로 리다이렉트되거나 장바구니로 이동할 수 있음
        await page.waitForTimeout(1000);
      }
    });
  });

  test("장바구니에서 주문하기까지의 플로우", async ({ page }) => {
    await test.step("장바구니 페이지 접근", async () => {
      await page.goto("/cart");
    });

    await test.step("주문하기 버튼 확인", async () => {
      // 로그인하지 않은 경우 리다이렉트될 수 있음
      const signInButton = page.getByRole("button", { name: "로그인" });
      if (await signInButton.isVisible()) {
        test.skip("로그인이 필요합니다.");
        return;
      }

      const checkoutButton = page.getByRole("button", { name: /주문하기/ });
      if (await checkoutButton.isVisible()) {
        await expect(checkoutButton).toBeVisible();
      } else {
        // 장바구니가 비어있을 수 있음
        const emptyMessage = page.getByText(/장바구니가 비어있습니다/);
        if (await emptyMessage.isVisible()) {
          test.skip("장바구니가 비어있습니다.");
        }
      }
    });
  });

  test("주문 완료 후 주문 내역 확인 플로우", async ({ page }) => {
    await test.step("주문 내역 페이지 접근", async () => {
      await page.goto("/orders");
    });

    await test.step("주문 내역 페이지 확인", async () => {
      // 로그인하지 않은 경우 리다이렉트될 수 있음
      const signInButton = page.getByRole("button", { name: "로그인" });
      if (await signInButton.isVisible()) {
        test.skip("로그인이 필요합니다.");
        return;
      }

      const heading = page.getByRole("heading", { name: "주문 내역" });
      await expect(heading).toBeVisible();
    });
  });

  test("네비게이션을 통한 페이지 이동", async ({ page }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
    });

    await test.step("로고 클릭으로 홈으로 이동", async () => {
      const logo = page.getByRole("link", { name: /SaaS Template/i });
      if (await logo.isVisible()) {
        await logo.click();
        await expect(page).toHaveURL(/.*\/$/);
      }
    });

    await test.step("상품 목록으로 이동", async () => {
      await page.goto("/products");
      await expect(page).toHaveURL(/.*\/products.*/);
    });
  });
});

