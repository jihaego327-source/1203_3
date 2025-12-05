/**
 * @file payment-widget.tsx
 * @description Toss Payments 결제위젯 컴포넌트
 *
 * Toss Payments SDK v2를 사용하여 결제위젯을 렌더링하고 결제를 처리합니다.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Toss Payments SDK 타입 선언
declare global {
  interface Window {
    TossPayments: any;
  }
}

interface PaymentWidgetProps {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
}

export function PaymentWidget({
  orderId,
  orderName,
  amount,
  customerEmail,
  customerName,
  customerMobilePhone,
}: PaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetsRef = useRef<any>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);
  const agreementWidgetRef = useRef<any>(null);

  // 클라이언트 키 확인
  const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;

  useEffect(() => {
    if (!clientKey) {
      setIsLoading(false);
      setError("Toss Payments 클라이언트 키가 설정되지 않았습니다.");
      console.error("Toss Payments 클라이언트 키가 설정되지 않았습니다.");
      return;
    }
    let script: HTMLScriptElement | null = null;

    const initializeWidget = async () => {
      try {
        if (!window.TossPayments) {
          throw new Error("Toss Payments SDK가 로드되지 않았습니다.");
        }

        const tossPayments = window.TossPayments(clientKey);
        const customerKey = `customer_${orderId}`; // 주문 ID 기반 고객 키 생성

        // 결제위젯 인스턴스 생성
        widgetsRef.current = tossPayments.widgets({
          customerKey,
        });

        // 결제 금액 설정
        await widgetsRef.current.setAmount({
          currency: "KRW",
          value: amount,
        });

        // 결제 UI 및 이용약관 UI 렌더링
        const [paymentMethodsWidget, agreementWidget] = await Promise.all([
          widgetsRef.current.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgetsRef.current.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        agreementWidgetRef.current = agreementWidget;

        setIsReady(true);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setIsLoading(false);
        const errorMessage =
          error instanceof Error ? error.message : "결제위젯 초기화 중 오류가 발생했습니다.";
        setError(errorMessage);
        console.error("결제위젯 초기화 오류:", error);
      }
    };

    // SDK가 이미 로드되어 있는지 확인
    if (window.TossPayments) {
      initializeWidget();
    } else {
      // SDK 로드
      script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.async = true;
      script.onload = initializeWidget;
      script.onerror = () => {
        setIsLoading(false);
        const errorMessage = "Toss Payments SDK를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error(errorMessage);
      };
      document.head.appendChild(script);
    }

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (paymentMethodsWidgetRef.current) {
        paymentMethodsWidgetRef.current.destroy().catch(() => {});
      }
      if (agreementWidgetRef.current) {
        agreementWidgetRef.current.destroy().catch(() => {});
      }
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [clientKey, orderId, amount]);

  if (!clientKey) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
        <p className="text-sm text-red-600 dark:text-red-400">
          Toss Payments 클라이언트 키가 설정되지 않았습니다.
        </p>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!widgetsRef.current || !isReady || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const successUrl = `${window.location.origin}/payment/success`;
      const failUrl = `${window.location.origin}/payment/fail`;

      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl,
        failUrl,
        customerEmail,
        customerName,
        customerMobilePhone,
      });
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error ? error.message : "결제 요청 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("결제 요청 오류:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">결제위젯을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
        <p className="text-sm text-red-600 dark:text-red-400 mb-2">
          {error}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setError(null);
            setIsLoading(true);
            window.location.reload();
          }}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 UI */}
      <div id="payment-method" className="min-h-[200px]"></div>

      {/* 이용약관 UI */}
      <div id="agreement"></div>

      {/* 결제하기 버튼 */}
      <Button
        size="lg"
        className="w-full hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:border-blue-500 border-2 border-transparent bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        onClick={handlePayment}
        disabled={!isReady || isProcessing}
      >
        {isProcessing ? "결제 처리 중..." : "결제하기"}
      </Button>
    </div>
  );
}
