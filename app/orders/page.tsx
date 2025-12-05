/**
 * @file page.tsx
 * @description 주문 목록 페이지
 *
 * 사용자의 주문 내역을 조회하고 표시하는 페이지입니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyOrders } from "@/components/empty-state";
import { getOrders } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils/format";
import { getOrderStatusLabel } from "@/lib/utils/order";
import { Calendar } from "lucide-react";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 주문 목록 조회
  let orders;
  try {
    orders = await getOrders();
  } catch (error) {
    console.error("주문 목록 조회 오류:", error);
    orders = [];
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
      <div className="w-full max-w-4xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            주문 내역
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            주문하신 내역을 확인하실 수 있습니다.
          </p>
        </div>

        {/* 주문 목록 */}
        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block"
              >
                <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* 주문 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          주문 번호: {order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
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
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>

                    {/* 주문 금액 */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        주문 금액
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {formatPrice(order.total_amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

