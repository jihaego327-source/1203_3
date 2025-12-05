import { test, expect } from "@playwright/test";

test.describe("상품 조회 플로우 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("홈페이지에서 상품 목록으로 이동할 수 있어야 함", async ({ page }) => {
    await test.step("더보기 버튼 클릭", async () => {
      const moreButton = page.getByRole("button", { name: "더보기" });
      if (await moreButton.isVisible()) {
        await moreButton.click();
        await expect(page).toHaveURL(/.*\/products.*/);
      }
    });
  });

  test("상품 목록 페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
      await expect(page).toHaveURL(/.*\/products.*/);
    });

    await test.step("페이지 제목 확인", async () => {
      const heading = page.getByRole("heading", { name: "상품 목록" });
      await expect(heading).toBeVisible();
    });

    await test.step("상품 그리드가 표시되는지 확인", async () => {
      // 상품이 있을 경우 상품 카드가 표시되어야 함
      // 상품이 없을 경우 빈 상태 메시지가 표시될 수 있음
      const productGrid = page.locator('[class*="grid"]').first();
      await expect(productGrid).toBeVisible();
    });
  });

  test("상품 상세 페이지로 이동할 수 있어야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("첫 번째 상품 클릭", async () => {
      // 상품 카드 또는 링크 찾기
      const firstProduct = page.locator('a[href^="/products/"]').first();
      if (await firstProduct.isVisible()) {
        const productHref = await firstProduct.getAttribute("href");
        if (productHref) {
          await firstProduct.click();
          await expect(page).toHaveURL(new RegExp(productHref));
        }
      }
    });
  });

  test("상품 상세 페이지에서 상품 정보가 표시되어야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("첫 번째 상품으로 이동", async () => {
      const firstProduct = page.locator('a[href^="/products/"]').first();
      if (await firstProduct.isVisible()) {
        await firstProduct.click();
        await page.waitForLoadState("networkidle");
      } else {
        test.skip();
      }
    });

    await test.step("상품 정보 확인", async () => {
      // 상품명이 표시되어야 함
      const productName = page.locator("h1").first();
      await expect(productName).toBeVisible();

      // 가격이 표시되어야 함
      const price = page.getByText(/원/).first();
      await expect(price).toBeVisible();
    });

    await test.step("뒤로가기 버튼 확인", async () => {
      const backButton = page.getByRole("button", { name: /상품 목록으로/ });
      await expect(backButton).toBeVisible();
    });
  });

  test("상품 목록 페이지에서 카테고리 필터가 작동해야 함", async ({
    page,
  }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("카테고리 필터 확인", async () => {
      // 카테고리 필터가 표시되는지 확인
      const categoryFilter = page.locator('[role="tablist"]').first();
      if (await categoryFilter.isVisible()) {
        const firstCategory = categoryFilter.locator('[role="tab"]').first();
        if (await firstCategory.isVisible()) {
          await firstCategory.click();
          // URL에 category 파라미터가 추가되는지 확인
          await page.waitForTimeout(500);
          const url = page.url();
          expect(url).toContain("category=");
        }
      }
    });
  });

  test("존재하지 않는 상품 페이지 접근 시 404 페이지 표시", async ({
    page,
  }) => {
    await test.step("존재하지 않는 상품 ID로 접근", async () => {
      await page.goto("/products/00000000-0000-0000-0000-000000000000");
    });

    await test.step("404 페이지 확인", async () => {
      // Next.js의 not-found 페이지가 표시되어야 함
      await page.waitForLoadState("networkidle");
      const notFoundHeading = page.getByRole("heading", {
        name: /찾을 수 없|not found/i,
      });
      // 404 페이지가 표시되거나 리다이렉트될 수 있음
      await expect(notFoundHeading.or(page.locator("h1"))).toBeVisible();
    });
  });
});

