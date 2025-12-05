/**
 * @file cart.ts
 * @description 장바구니 관련 Zod 스키마
 */

import { z } from "zod";

/**
 * 장바구니 추가 입력 스키마
 */
export const addToCartSchema = z.object({
  productId: z.string().uuid("올바른 상품 ID 형식이 아닙니다."),
  quantity: z.number().int().positive("수량은 1개 이상이어야 합니다."),
});

/**
 * 장바구니 수량 변경 스키마
 */
export const updateCartItemSchema = z.object({
  cartItemId: z.string().uuid("올바른 장바구니 아이템 ID 형식이 아닙니다."),
  quantity: z.number().int().positive("수량은 1개 이상이어야 합니다."),
});

/**
 * 장바구니 삭제 스키마
 */
export const removeFromCartSchema = z.object({
  cartItemId: z.string().uuid("올바른 장바구니 아이템 ID 형식이 아닙니다."),
});

