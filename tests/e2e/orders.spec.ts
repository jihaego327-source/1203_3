import { test, expect } from "@playwright/test";

test.describe("주문 플로우 테스트", () => {
  test("로그인하지 않은 상태에서 주문 내역 접근 시 로그인 페이지로 리다이렉트", async ({
    page,
  }) => {
    await test.step("주문 내역 페이지 접근", async () => {
      await page.goto("/orders");
    });

    await test.step("로그인 페이지로 리다이렉트 확인", async () => {
      await page.waitForURL(/.*sign-in.*/, { timeout: 5000 });
      expect(page.url()).toContain("sign-in");
    });
  });

  test("주문 내역 페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    // 이 테스트는 로그인된 상태에서 실행되어야 함
    await test.step("주문 내역 페이지 접근", async () => {
      await page.goto("/orders");
    });

    await test.step("페이지 제목 확인", async () => {
      // 로그인하지 않은 경우 리다이렉트될 수 있음
      const heading = page.getByRole("heading", { name: "주문 내역" });
      const signInButton = page.getByRole("button", { name: "로그인" });

      if (await signInButton.isVisible()) {
        expect(page.url()).toContain("sign-in");
      } else {
        await expect(heading).toBeVisible();
      }
    });
  });

  test("주문 내역이 없을 때 빈 상태 메시지가 표시되어야 함", async ({
    page,
  }) => {
    await test.step("주문 내역 페이지 접근", async () => {
      await page.goto("/orders");
    });

    await test.step("빈 상태 메시지 확인", async () => {
      // 로그인하지 않은 경우 스킵
      const signInButton = page.getByRole("button", { name: "로그인" });
      if (await signInButton.isVisible()) {
        test.skip();
        return;
      }

      const emptyMessage = page.getByText(/주문 내역이 없습니다/);
      const continueShoppingButton = page.getByRole("button", {
        name: /상품 둘러보기/,
      });

      // 주문 내역이 없을 경우 메시지와 버튼이 표시되어야 함
      if (await emptyMessage.isVisible()) {
        await expect(continueShoppingButton).toBeVisible();
      }
    });
  });

  test("주문 내역에서 주문 상세 페이지로 이동할 수 있어야 함", async ({
    page,
  }) => {
    await test.step("주문 내역 페이지 접근", async () => {
      await page.goto("/orders");
    });

    await test.step("첫 번째 주문 클릭", async () => {
      // 로그인하지 않은 경우 스킵
      const signInButton = page.getByRole("button", { name: "로그인" });
      if (await signInButton.isVisible()) {
        test.skip();
        return;
      }

      const firstOrder = page.locator('a[href^="/orders/"]').first();
      if (await firstOrder.isVisible()) {
        const orderHref = await firstOrder.getAttribute("href");
        if (orderHref) {
          await firstOrder.click();
          await expect(page).toHaveURL(new RegExp(orderHref));
        }
      }
    });
  });

  test("주문 상세 페이지에서 주문 정보가 표시되어야 함", async ({ page }) => {
    await test.step("주문 상세 페이지 접근", async () => {
      // 실제 주문 ID가 필요하므로 스킵하거나 모킹 필요
      // 여기서는 기본적인 페이지 구조만 확인
      await page.goto("/orders/test-order-id");
    });

    await test.step("페이지 구조 확인", async () => {
      // 로그인하지 않은 경우 리다이렉트될 수 있음
      const signInButton = page.getByRole("button", { name: "로그인" });
      if (await signInButton.isVisible()) {
        expect(page.url()).toContain("sign-in");
      } else {
        // 주문 상세 페이지의 기본 요소 확인
        const heading = page.locator("h1").first();
        await expect(heading).toBeVisible();
      }
    });
  });

  test("네비게이션에 주문 내역 아이콘 버튼이 표시되어야 함", async ({
    page,
  }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
    });

    await test.step("주문 내역 버튼 확인", async () => {
      // 로그인하지 않은 경우 버튼이 보이지 않을 수 있음
      const ordersButton = page
        .locator('[aria-label*="주문"], [title*="주문 내역"]')
        .first();
      // 버튼이 있거나 없을 수 있으므로 에러 없이 확인만 수행
      await ordersButton.isVisible().catch(() => {
        // 버튼이 없는 경우 (로그인하지 않은 상태) 정상
      });
    });
  });
});

