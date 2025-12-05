/**
 * @file page.tsx
 * @description 주문 상세 페이지
 *
 * 특정 주문의 상세 정보를 표시하는 페이지입니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils/format";
import { getOrderStatusLabel } from "@/lib/utils/order";
import { ArrowLeft, Package, MapPin, FileText } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { orderId } = await params;

  // 주문 상세 정보 조회
  let order;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    console.error("주문 상세 조회 오류:", error);
    redirect("/orders");
  }

  // 주문이 없거나 본인의 주문이 아닌 경우
  if (!order || order.clerk_id !== userId) {
    redirect("/orders");
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-3xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Link href="/orders" className="inline-flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
          <ArrowLeft className="w-4 h-4" />
          <span>주문 내역으로 돌아가기</span>
        </Link>

        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            주문 상세
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            주문 번호: {order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* 주문 기본 정보 */}
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
              <span
                className={`px-2 py-1 text-sm font-medium rounded ${
                  order.status === "confirmed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : order.status === "delivered"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문 일시</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(order.created_at)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문 금액</span>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* 배송지 정보 */}
        {order.shipping_address && (
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                배송지 정보
              </h2>
            </div>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {order.shipping_address.name}
              </p>
              <p>{order.shipping_address.phone}</p>
              <p>
                ({order.shipping_address.postalCode}) {order.shipping_address.address}
                {order.shipping_address.detailAddress &&
                  ` ${order.shipping_address.detailAddress}`}
              </p>
            </div>
          </div>
        )}

        {/* 주문 메모 */}
        {order.order_note && (
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                주문 메모
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {order.order_note}
            </p>
          </div>
        )}

        {/* 주문 상품 목록 */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                주문 상품
              </h2>
            </div>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start pb-4 border-b last:border-b-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      수량: {item.quantity}개
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      단가: {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              주문 내역으로 돌아가기
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">쇼핑 계속하기</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

