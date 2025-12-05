/**
 * @file products.ts
 * @description 상품 데이터 조회를 위한 Server Actions
 *
 * Server Component와 Server Actions에서 사용할 수 있는 상품 데이터 fetching 함수들
 */

import { createClient } from "@/lib/supabase/server";
import type { Product, ProductFilters, ProductSortOption } from "@/lib/types/product";

/**
 * 모든 활성화된 상품을 조회합니다
 * @param limit - 조회할 상품 개수 (기본값: 전체)
 * @param filters - 필터 옵션
 * @param sortBy - 정렬 옵션 (기본값: created_at_desc)
 * @param offset - 건너뛸 상품 개수 (페이지네이션용)
 * @returns 상품 배열
 */
export async function getProducts(
  limit?: number,
  filters?: ProductFilters,
  sortBy: ProductSortOption = "created_at_desc",
  offset?: number
): Promise<Product[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", filters?.is_active ?? true);

    // 카테고리 필터
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    // 가격 범위 필터
    if (filters?.min_price !== undefined) {
      query = query.gte("price", filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      query = query.lte("price", filters.max_price);
    }

    // 정렬
    switch (sortBy) {
      case "created_at_desc":
        query = query.order("created_at", { ascending: false });
        break;
      case "created_at_asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
    }

    // 페이지네이션: offset과 limit 처리
    if (offset !== undefined && offset >= 0 && limit !== undefined) {
      // offset과 limit이 모두 있는 경우 range 사용 (range는 inclusive)
      query = query.range(offset, offset + limit - 1);
    } else if (limit !== undefined) {
      // limit만 있는 경우
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("상품 조회 오류:", error);
      throw new Error("상품을 불러오는 중 오류가 발생했습니다.");
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("상품 조회 중 예외 발생:", error);
    throw error;
  }
}

/**
 * ID로 단일 상품을 조회합니다
 * @param id - 상품 ID
 * @returns 상품 또는 null
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 데이터가 없음
        return null;
      }
      console.error("상품 조회 오류:", error);
      throw new Error("상품을 불러오는 중 오류가 발생했습니다.");
    }

    return data as Product;
  } catch (error) {
    console.error("상품 조회 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 카테고리 목록을 조회합니다
 * @returns 고유한 카테고리 배열
 */
export async function getCategories(): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("category")
      .eq("is_active", true)
      .not("category", "is", null);

    if (error) {
      console.error("카테고리 조회 오류:", error);
      return [];
    }

    // 중복 제거 및 null 제거
    const categories = Array.from(
      new Set(
        (data || [])
          .map((item) => item.category)
          .filter((cat): cat is string => cat !== null)
      )
    );

    return categories.sort();
  } catch (error) {
    console.error("카테고리 조회 중 예외 발생:", error);
    return [];
  }
}

/**
 * 필터 조건에 맞는 총 상품 개수를 조회합니다
 * @param filters - 필터 옵션
 * @returns 총 상품 개수
 */
export async function getProductsCount(
  filters?: ProductFilters
): Promise<number> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", filters?.is_active ?? true);

    // 카테고리 필터
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    // 가격 범위 필터
    if (filters?.min_price !== undefined) {
      query = query.gte("price", filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      query = query.lte("price", filters.max_price);
    }

    const { count, error } = await query;

    if (error) {
      console.error("상품 개수 조회 오류:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("상품 개수 조회 중 예외 발생:", error);
    return 0;
  }
}

