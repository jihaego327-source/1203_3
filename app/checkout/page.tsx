/**
 * @file page.tsx
 * @description 주문 페이지
 *
 * 배송지 정보 입력 및 주문 요약을 표시하는 페이지입니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderSummary } from "@/components/order-summary";
import { getCartItems, getCartTotal } from "@/lib/actions/cart";

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [items, total] = await Promise.all([
    getCartItems(),
    getCartTotal(),
  ]);

  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  if (items.length === 0) {
    redirect("/cart");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            주문하기
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            배송지 정보를 입력하고 주문을 완료하세요.
          </p>
        </div>

        {/* 주문 폼 및 요약 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주문 폼 */}
          <div>
            <CheckoutForm />
          </div>

          {/* 주문 요약 */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <OrderSummary items={items} total={total.subtotal} />
          </div>
        </div>
      </div>
    </main>
  );
}

