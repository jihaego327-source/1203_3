/**
 * @file route.ts
 * @description 결제 승인 API Route
 *
 * Toss Payments 결제 승인을 처리하는 API 엔드포인트입니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/actions/payments";
import type { ConfirmPaymentRequest } from "@/lib/types/payment";

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmPaymentRequest = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 금액 검증 (양수인지 확인)
    if (amount <= 0) {
      return NextResponse.json(
        { error: "유효하지 않은 결제 금액입니다." },
        { status: 400 }
      );
    }

    // 결제 승인 처리
    const paymentResponse = await confirmPayment(paymentKey, orderId, amount);

    return NextResponse.json({
      success: true,
      payment: paymentResponse,
    });
  } catch (error) {
    console.error("결제 승인 API 오류:", error);
    const errorMessage =
      error instanceof Error ? error.message : "결제 승인 중 오류가 발생했습니다.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

