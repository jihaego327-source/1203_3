/**
 * @file product.ts
 * @description 상품 관련 타입 정의
 *
 * 데이터베이스의 products 테이블 스키마와 일치하는 타입을 정의합니다.
 */

/**
 * 상품 타입
 * Supabase의 products 테이블과 일치
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 목록 조회를 위한 필터 옵션
 */
export interface ProductFilters {
  category?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
}

/**
 * 상품 목록 조회를 위한 정렬 옵션
 */
export type ProductSortOption =
  | "created_at_desc"
  | "created_at_asc"
  | "price_desc"
  | "price_asc"
  | "name_asc";

