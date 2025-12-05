/**
 * @file page.tsx
 * @description 결제 페이지
 *
 * 주문 정보를 표시하고 결제위젯을 렌더링하는 페이지입니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaymentWidget } from "@/components/payment-widget";
import { OrderSummary } from "@/components/order-summary";
import { getOrderById } from "@/lib/actions/orders";

interface PaymentPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentPage({
  searchParams,
}: PaymentPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/checkout");
  }

  // 주문 정보 조회
  const order = await getOrderById(orderId);

  if (!order) {
    redirect("/checkout");
  }

  // 주문이 이미 확인되었거나 취소된 경우 처리
  if (order.status !== "pending") {
    if (order.status === "confirmed") {
      redirect(`/order-complete?orderId=${orderId}`);
    } else {
      redirect("/cart");
    }
  }

  // 주문 상세 아이템이 없는 경우 처리
  if (!order.order_items || order.order_items.length === 0) {
    redirect("/checkout");
  }

  // 고객 정보 추출 (배송지 정보에서)
  const shippingAddress = order.shipping_address;
  const customerName = shippingAddress?.name || "고객";
  const customerPhone = shippingAddress?.phone || "";
  // 이메일은 Clerk에서 가져와야 하지만, 여기서는 기본값 사용
  const customerEmail = `${userId}@example.com`; // 실제로는 Clerk에서 가져와야 함

  // 주문명 생성 (상품명 외 N건 형식)
  const orderName =
    order.order_items.length === 1
      ? order.order_items[0].product_name
      : `${order.order_items[0].product_name} 외 ${order.order_items.length - 1}건`;

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/checkout" className="inline-block mb-4">
            <Button variant="outline" size="sm">
              ← 주문 정보로 돌아가기
            </Button>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            결제하기
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            결제 정보를 확인하고 결제를 진행하세요.
          </p>
        </div>

        {/* 주문 요약 및 결제위젯 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주문 요약 */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <OrderSummary
              items={order.order_items.map((item) => ({
                id: item.id,
                clerk_id: order.clerk_id,
                product_id: item.product_id,
                quantity: item.quantity,
                created_at: item.created_at,
                updated_at: item.created_at,
                product: {
                  id: item.product_id,
                  name: item.product_name,
                  description: null,
                  price: item.price,
                  category: null,
                  stock_quantity: 0,
                  is_active: true,
                  created_at: item.created_at,
                  updated_at: item.created_at,
                },
              }))}
              total={order.total_amount}
            />
          </div>

          {/* 결제위젯 */}
          <div>
            <PaymentWidget
              orderId={orderId}
              orderName={orderName}
              amount={order.total_amount}
              customerEmail={customerEmail}
              customerName={customerName}
              customerMobilePhone={customerPhone}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

