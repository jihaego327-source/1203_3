/**
 * @file page.tsx
 * @description 결제 실패 콜백 페이지
 *
 * Toss Payments 결제 실패 후 콜백을 처리하고 사용자에게 에러 메시지를 표시합니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface PaymentFailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const { code, message, orderId } = await searchParams;

  // 에러 메시지 매핑
  const getErrorMessage = (errorCode?: string, errorMessage?: string) => {
    if (!errorCode && !errorMessage) {
      return "결제가 취소되었습니다.";
    }

    // 일반적인 에러 코드 처리
    switch (errorCode) {
      case "PAY_PROCESS_CANCELED":
        return "결제가 취소되었습니다.";
      case "PAY_PROCESS_ABORTED":
        return errorMessage || "결제가 중단되었습니다.";
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제를 거절했습니다. 카드 정보를 확인해주세요.";
      default:
        return errorMessage || "결제 처리 중 오류가 발생했습니다.";
    }
  };

  const errorMessage = getErrorMessage(code, message);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            결제 실패
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{errorMessage}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
          {code && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                에러 코드:
              </span>
              <code className="ml-2 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {code}
              </code>
            </div>
          )}
          {orderId && (
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                주문 번호:
              </span>
              <code className="ml-2 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {orderId}
              </code>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderId && (
            <Link href={`/payment?orderId=${orderId}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">다시 결제하기</Button>
            </Link>
          )}
          <Link href="/cart" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              장바구니로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

