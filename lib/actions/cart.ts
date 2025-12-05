"use server";

/**
 * @file cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 장바구니 CRUD 작업을 처리하는 Server Actions입니다.
 */

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { addToCartSchema, updateCartItemSchema } from "@/lib/schemas/cart";
import type {
  CartItemWithProduct,
  CartTotal,
} from "@/lib/types/cart";

/**
 * 현재 사용자의 장바구니 아이템을 조회합니다 (상품 정보 포함)
 * @returns 장바구니 아이템 배열
 */
export async function getCartItems(): Promise<CartItemWithProduct[]> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("장바구니 조회 오류:", error);
      throw new Error("장바구니를 불러오는 중 오류가 발생했습니다.");
    }

    // 타입 변환
    return (data || []).map((item: any) => ({
      ...item,
      product: item.product,
    })) as CartItemWithProduct[];
  } catch (error) {
    console.error("장바구니 조회 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 장바구니에 상품을 추가하거나 수량을 증가시킵니다
 * @param productId - 상품 ID
 * @param quantity - 추가할 수량 (기본값: 1)
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<void> {
  try {
    // Zod 스키마로 입력값 검증
    const validated = addToCartSchema.parse({ productId, quantity });

    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = await createClient();

    // 상품 정보 조회 (재고 확인)
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, stock_quantity, is_active, price")
      .eq("id", validated.productId)
      .single();

    if (productError || !product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    if (!product.is_active) {
      throw new Error("판매 중지된 상품입니다.");
    }

    // 기존 장바구니 아이템 조회
    const { data: existingItem, error: existingError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("clerk_id", userId)
      .eq("product_id", validated.productId)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      // PGRST116은 "no rows returned" 에러 (아이템이 없는 경우)
      console.error("장바구니 조회 오류:", existingError);
      throw new Error("장바구니 조회 중 오류가 발생했습니다.");
    }

    if (existingItem) {
      // 기존 아이템이 있으면 수량 증가
      const newQuantity = existingItem.quantity + validated.quantity;

      if (newQuantity > product.stock_quantity) {
        throw new Error(
          `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
        );
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("장바구니 수량 업데이트 오류:", updateError);
        throw new Error("장바구니 수량 업데이트 중 오류가 발생했습니다.");
      }
    } else {
      // 새 아이템 추가
      if (validated.quantity > product.stock_quantity) {
        throw new Error(
          `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
        );
      }

      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          clerk_id: userId,
          product_id: validated.productId,
          quantity: validated.quantity,
        });

      if (insertError) {
        console.error("장바구니 추가 오류:", insertError);
        throw new Error("장바구니에 추가하는 중 오류가 발생했습니다.");
      }
    }
  } catch (error) {
    console.error("장바구니 추가 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 장바구니 아이템의 수량을 변경합니다
 * @param cartItemId - 장바구니 아이템 ID
 * @param quantity - 새로운 수량
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<void> {
  try {
    // Zod 스키마로 입력값 검증
    const validated = updateCartItemSchema.parse({ cartItemId, quantity });

    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = await createClient();

    // 장바구니 아이템과 상품 정보 조회
    const { data: cartItem, error: cartError } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(stock_quantity, is_active)
      `
      )
      .eq("id", validated.cartItemId)
      .eq("clerk_id", userId)
      .single();

    if (cartError || !cartItem) {
      throw new Error("장바구니 아이템을 찾을 수 없습니다.");
    }

    const product = (cartItem as any).product;
    if (!product.is_active) {
      throw new Error("판매 중지된 상품입니다.");
    }

    if (validated.quantity > product.stock_quantity) {
      throw new Error(
        `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
      );
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: validated.quantity })
      .eq("id", validated.cartItemId)
      .eq("clerk_id", userId);

    if (updateError) {
      console.error("장바구니 수량 변경 오류:", updateError);
      throw new Error("장바구니 수량 변경 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("장바구니 수량 변경 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 장바구니에서 아이템을 삭제합니다
 * @param cartItemId - 장바구니 아이템 ID
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("장바구니 삭제 오류:", error);
      throw new Error("장바구니에서 삭제하는 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("장바구니 삭제 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 현재 사용자의 장바구니를 모두 비웁니다
 */
export async function clearCart(): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", userId);

    if (error) {
      console.error("장바구니 비우기 오류:", error);
      throw new Error("장바구니를 비우는 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("장바구니 비우기 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 현재 사용자의 장바구니 총액을 계산합니다
 * @returns 장바구니 총액 정보
 */
export async function getCartTotal(): Promise<CartTotal> {
  try {
    const items = await getCartItems();

    const subtotal = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const itemCount = items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    return {
      subtotal,
      itemCount,
    };
  } catch (error) {
    console.error("장바구니 총액 계산 중 예외 발생:", error);
    return {
      subtotal: 0,
      itemCount: 0,
    };
  }
}

