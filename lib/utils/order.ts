/**
 * @file order.ts
 * @description 주문 관련 유틸리티 함수
 */

import type { OrderStatus } from "@/lib/types/order";

/**
 * 주문 상태를 한글로 변환합니다
 * @param status - 주문 상태
 * @returns 한글로 변환된 주문 상태
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    pending: "결제 대기",
    confirmed: "결제 완료",
    shipped: "배송 중",
    delivered: "배송 완료",
    cancelled: "취소됨",
  };

  return statusMap[status] || status;
}

