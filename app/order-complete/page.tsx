/**
 * @file page.tsx
 * @description 주문 완료 페이지
 *
 * 결제가 완료된 후 주문 완료 메시지와 주문 정보를 표시합니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { getOrderById } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils/format";

interface OrderCompletePageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderCompletePage({
  searchParams,
}: OrderCompletePageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  // 주문 정보 조회
  const order = await getOrderById(orderId);

  if (!order || order.clerk_id !== userId) {
    redirect("/");
  }

  // 주문이 확인되지 않은 경우
  if (order.status !== "confirmed") {
    redirect(`/payment?orderId=${orderId}`);
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-3xl mx-auto">
        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            주문이 완료되었습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            주문해주셔서 감사합니다.
          </p>
        </div>

        {/* 주문 정보 */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            주문 정보
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문 번호</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문 상태</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {order.status === "confirmed" ? "결제 완료" : order.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문 금액</span>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {formatPrice(order.total_amount)}
              </span>
            </div>

            {order.shipping_address && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  배송지 정보
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{order.shipping_address.name}</p>
                  <p>{order.shipping_address.phone}</p>
                  <p>
                    ({order.shipping_address.postalCode}) {order.shipping_address.address}
                    {order.shipping_address.detailAddress &&
                      ` ${order.shipping_address.detailAddress}`}
                  </p>
                </div>
              </div>
            )}

            {order.order_items && order.order_items.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  주문 상품
                </h3>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">주문 내역 보기</Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

