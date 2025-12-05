/**
 * @file cart.ts
 * @description 장바구니 관련 타입 정의
 *
 * 데이터베이스의 cart_items 테이블 스키마와 일치하는 타입을 정의합니다.
 */

import type { Product } from "./product";

/**
 * 장바구니 아이템 타입
 * Supabase의 cart_items 테이블과 일치
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 정보가 포함된 장바구니 아이템 타입
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

/**
 * 장바구니 총액 계산 결과
 */
export interface CartTotal {
  subtotal: number;
  itemCount: number;
}

