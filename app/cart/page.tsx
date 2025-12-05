/**
 * @file page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고, 주문하기 버튼을 제공합니다.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { CartItemList } from "@/components/cart-item-list";
import { EmptyCart } from "@/components/empty-state";
import { getCartItems, getCartTotal } from "@/lib/actions/cart";
import { formatPrice } from "@/lib/utils/format";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [items, total] = await Promise.all([
    getCartItems(),
    getCartTotal(),
  ]);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            장바구니
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            장바구니에 담긴 상품을 확인하고 주문하세요.
          </p>
        </div>

        {/* 장바구니 아이템 목록 */}
        <div className="mb-8">
          <CartItemList items={items} />
        </div>

        {/* 총액 및 주문하기 버튼 */}
        {items.length > 0 && (
          <div className="border-t pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* 총액 정보 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    총 상품 개수:
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {total.itemCount}개
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    총 주문 금액:
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(total.subtotal)}
                  </span>
                </div>
              </div>

              {/* 주문하기 버튼 */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    쇼핑 계속하기
                  </Button>
                </Link>
                <Link href="/checkout" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    주문하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 빈 장바구니 안내 */}
        {items.length === 0 && <EmptyCart />}
      </div>
    </main>
  );
}

