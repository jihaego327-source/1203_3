/**
 * @file order.ts
 * @description 주문 관련 타입 정의
 *
 * 데이터베이스의 orders, order_items 테이블 스키마와 일치하는 타입을 정의합니다.
 */

/**
 * 배송지 정보 타입
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress?: string;
}

/**
 * 주문 상세 아이템 타입
 * Supabase의 order_items 테이블과 일치
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 주문 타입
 * Supabase의 orders 테이블과 일치
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 상세 정보 타입 (주문 + 주문 상세 아이템들)
 */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * 주문 생성 입력 타입
 */
export interface CreateOrderInput {
  clerkId: string;
  shippingAddress: ShippingAddress;
  orderNote?: string;
}

