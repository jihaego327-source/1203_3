/**
 * @file page.tsx
 * @description 결제 성공 콜백 페이지
 *
 * Toss Payments 결제 성공 후 콜백을 처리하고 결제를 승인합니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/orders";
import { confirmPayment } from "@/lib/actions/payments";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { paymentKey, orderId, amount } = await searchParams;

  // 필수 파라미터 확인
  if (!paymentKey || !orderId || !amount) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
              결제 정보 오류
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              결제 정보가 올바르지 않습니다.
            </p>
          </div>
          <Link href="/cart">
            <Button>장바구니로 돌아가기</Button>
          </Link>
        </div>
      </main>
    );
  }

  try {
    const amountNumber = parseInt(amount, 10);

    // 주문 정보 조회 및 소유자 확인
    const order = await getOrderById(orderId);
    if (!order || order.clerk_id !== userId) {
      return (
        <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
                주문을 찾을 수 없습니다
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                주문 정보를 확인할 수 없습니다.
              </p>
            </div>
            <Link href="/cart">
              <Button>장바구니로 돌아가기</Button>
            </Link>
          </div>
        </main>
      );
    }

    // 결제 승인 처리
    await confirmPayment(paymentKey, orderId, amountNumber);

    // 결제 승인 성공 시 주문 완료 페이지로 리다이렉트
    redirect(`/order-complete?orderId=${orderId}`);
  } catch (error) {
    console.error("결제 승인 오류:", error);
    const errorMessage =
      error instanceof Error ? error.message : "결제 승인 중 오류가 발생했습니다.";

    return (
      <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
        <div className="w-full max-w-2xl mx-auto">
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              결제 승인 실패
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{errorMessage}</p>
            <div className="flex gap-4">
              <Link href={`/payment?orderId=${orderId}`}>
                <Button variant="outline">다시 시도</Button>
              </Link>
              <Link href="/cart">
                <Button>장바구니로 돌아가기</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

