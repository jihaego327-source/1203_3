/**
 * @file checkout-success.tsx
 * @description 결제 완료 화면 컴포넌트
 *
 * 결제 완료 시 표시되는 성공 화면입니다.
 * CSS 기반 체크마크 애니메이션을 포함합니다.
 *
 * @dependencies
 * - lucide-react: CheckCircle 아이콘
 */

"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CheckoutSuccessProps {
  orderId?: string;
  orderName?: string;
  amount?: number;
}

export function CheckoutSuccess({
  orderId,
  orderName,
  amount,
}: CheckoutSuccessProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 체크마크 애니메이션 */}
        <div className="mb-8 flex justify-center">
          <div
            className={`relative transition-all duration-500 ${
              isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping" />
            <div className="relative bg-blue-600 dark:bg-blue-500 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-white animate-in zoom-in duration-500" />
            </div>
          </div>
        </div>

        {/* 성공 메시지 */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          결제가 완료되었습니다!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          주문이 성공적으로 처리되었습니다.
        </p>

        {/* 주문 정보 */}
        {(orderId || orderName || amount) && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 text-left">
            {orderId && (
              <div className="mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">주문번호:</span>
                <p className="text-base font-medium text-gray-900 dark:text-white">{orderId}</p>
              </div>
            )}
            {orderName && (
              <div className="mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">주문명:</span>
                <p className="text-base font-medium text-gray-900 dark:text-white">{orderName}</p>
              </div>
            )}
            {amount && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">결제 금액:</span>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {amount.toLocaleString()}원
                </p>
              </div>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button size="lg" variant="outline">
              주문 내역 보기
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg">
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

