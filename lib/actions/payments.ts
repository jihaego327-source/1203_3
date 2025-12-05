"use server";

/**
 * @file payments.ts
 * @description 결제 관련 Server Actions
 *
 * Toss Payments API와 연동하여 결제 승인 및 주문 상태 업데이트를 처리합니다.
 */

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type {
  PaymentResponse,
} from "@/lib/types/payment";
import { getOrderById } from "./orders";

/**
 * 주문 상태를 업데이트합니다
 * @param orderId - 주문 ID
 * @param status - 새로운 주문 상태
 */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = await createClient();

    // 주문 소유자 확인
    const order = await getOrderById(orderId);
    if (!order || order.clerk_id !== userId) {
      throw new Error("주문을 찾을 수 없거나 권한이 없습니다.");
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("주문 상태 업데이트 오류:", error);
      throw new Error("주문 상태 업데이트 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("주문 상태 업데이트 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 결제 금액을 검증합니다
 * @param orderId - 주문 ID
 * @param amount - 검증할 금액
 * @returns 금액이 일치하면 true
 */
export async function verifyPaymentAmount(
  orderId: string,
  amount: number
): Promise<boolean> {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return false;
    }

    // 금액 비교 (소수점 오차 고려)
    return Math.abs(order.total_amount - amount) < 0.01;
  } catch (error) {
    console.error("결제 금액 검증 중 예외 발생:", error);
    return false;
  }
}

/**
 * Toss Payments 결제 승인 API를 호출합니다
 * @param paymentKey - 결제 키
 * @param orderId - 주문 ID
 * @param amount - 결제 금액
 * @returns 결제 응답
 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<PaymentResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    // 주문 소유자 확인 및 금액 검증
    const order = await getOrderById(orderId);
    if (!order || order.clerk_id !== userId) {
      throw new Error("주문을 찾을 수 없거나 권한이 없습니다.");
    }

    if (!(await verifyPaymentAmount(orderId, amount))) {
      throw new Error("결제 금액이 주문 금액과 일치하지 않습니다.");
    }

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Toss Payments 시크릿 키가 설정되지 않았습니다.");
    }

    // Basic 인증 헤더 생성 (시크릿 키:base64)
    const authHeader = Buffer.from(`${secretKey}:`).toString("base64");

    // Toss Payments 결제 승인 API 호출
    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `결제 승인 실패: ${response.statusText}`
      );
    }

    const paymentResponse: PaymentResponse = await response.json();

    // 결제 성공 시 주문 상태를 'confirmed'로 업데이트
    if (paymentResponse.status === "DONE") {
      await updateOrderStatus(orderId, "confirmed");
    }

    return paymentResponse;
  } catch (error) {
    console.error("결제 승인 중 예외 발생:", error);
    throw error;
  }
}

