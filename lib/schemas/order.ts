/**
 * @file order.ts
 * @description 주문 관련 Zod 스키마
 */

import { z } from "zod";

/**
 * 배송지 정보 스키마
 */
export const shippingAddressSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .regex(/^[0-9-]+$/, "올바른 연락처 형식이 아닙니다."),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요.")
    .regex(/^[0-9]{5}$/, "올바른 우편번호 형식이 아닙니다."),
  address: z.string().min(1, "주소를 입력해주세요."),
  detailAddress: z.string().optional(),
});

/**
 * 주문 생성 입력 스키마
 */
export const createOrderInputSchema = z.object({
  clerkId: z.string().min(1, "사용자 ID가 필요합니다."),
  shippingAddress: shippingAddressSchema,
  orderNote: z.string().optional(),
});

