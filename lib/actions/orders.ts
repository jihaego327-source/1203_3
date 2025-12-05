"use server";

/**
 * @file orders.ts
 * @description 주문 관련 Server Actions
 *
 * 주문 생성, 조회 등의 작업을 처리하는 Server Actions입니다.
 */

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type {
  Order,
  OrderWithItems,
  CreateOrderInput,
} from "@/lib/types/order";
import { createOrderInputSchema } from "@/lib/schemas/order";
import { getCartItems } from "./cart";

/**
 * 주문을 생성합니다
 * @param input - 주문 생성 입력 정보
 * @returns 생성된 주문 ID
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<string> {
  try {
    // Zod 스키마로 입력값 검증
    const validatedInput = createOrderInputSchema.parse(input);

    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    if (validatedInput.clerkId !== userId) {
      throw new Error("권한이 없습니다.");
    }

    const supabase = await createClient();

    // 1. 장바구니 아이템 조회
    const cartItems = await getCartItems();

    if (cartItems.length === 0) {
      throw new Error("장바구니가 비어있습니다.");
    }

    // 2. 상품 정보 및 재고 확인
    const productIds = cartItems.map((item) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .in("id", productIds);

    if (productsError || !products) {
      throw new Error("상품 정보를 불러오는 중 오류가 발생했습니다.");
    }

    const productMap = new Map(
      products.map((p) => [p.id, p])
    );

    // 3. 검증: 재고, 활성화 상태, 가격 확인
    let totalAmount = 0;
    const orderItems: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      price: number;
    }> = [];

    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.product_id);

      if (!product) {
        throw new Error(`상품을 찾을 수 없습니다: ${cartItem.product.name}`);
      }

      if (!product.is_active) {
        throw new Error(`판매 중지된 상품이 있습니다: ${product.name}`);
      }

      if (cartItem.quantity > product.stock_quantity) {
        throw new Error(
          `재고가 부족합니다: ${product.name} (요청: ${cartItem.quantity}개, 재고: ${product.stock_quantity}개)`
        );
      }

      // 가격 검증 (가격이 변경되었는지 확인)
      if (Math.abs(product.price - cartItem.product.price) > 0.01) {
        throw new Error(
          `가격이 변경되었습니다: ${product.name} (기존: ${formatPrice(cartItem.product.price)}, 현재: ${formatPrice(product.price)})`
        );
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    // 4. 주문 생성 (트랜잭션 처리)
    // Supabase는 트랜잭션을 직접 지원하지 않으므로, 순차적으로 처리하고 에러 시 롤백
    let orderId: string;

    try {
      // 4-1. orders 테이블에 주문 저장
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          clerk_id: userId,
          total_amount: totalAmount,
          status: "pending",
          shipping_address: validatedInput.shippingAddress,
          order_note: validatedInput.orderNote || null,
        })
        .select("id")
        .single();

      if (orderError || !order) {
        throw new Error("주문 생성 중 오류가 발생했습니다.");
      }

      orderId = order.id;

      // 4-2. order_items 테이블에 주문 상세 저장
      const orderItemsToInsert = orderItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (orderItemsError) {
        // 롤백: 주문 삭제
        await supabase.from("orders").delete().eq("id", orderId);
        throw new Error("주문 상세 저장 중 오류가 발생했습니다.");
      }

      // 4-3. 재고 차감
      for (const item of orderItems) {
        const product = productMap.get(item.product_id);
        if (product) {
          const { error: stockError } = await supabase
            .from("products")
            .update({
              stock_quantity: product.stock_quantity - item.quantity,
            })
            .eq("id", item.product_id);

          if (stockError) {
            console.error("재고 차감 오류:", stockError);
            // 재고 차감 실패는 로그만 남기고 계속 진행
            // 실제 운영 환경에서는 트랜잭션으로 처리해야 함
          }
        }
      }

      // 4-4. 장바구니 비우기
      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("clerk_id", userId);

      if (clearCartError) {
        console.error("장바구니 비우기 오류:", clearCartError);
        // 장바구니 비우기 실패는 로그만 남기고 계속 진행
      }
    } catch (error) {
      console.error("주문 생성 중 예외 발생:", error);
      throw error;
    }

    return orderId;
  } catch (error) {
    console.error("주문 생성 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 현재 사용자의 주문 목록을 조회합니다
 * @returns 주문 배열
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("주문 목록 조회 오류:", error);
      throw new Error("주문 목록을 불러오는 중 오류가 발생했습니다.");
    }

    return (data || []) as Order[];
  } catch (error) {
    console.error("주문 목록 조회 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 주문 상세 정보를 조회합니다 (주문 상세 아이템 포함)
 * @param orderId - 주문 ID
 * @returns 주문 상세 정보
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = await createClient();

    // 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError) {
      if (orderError.code === "PGRST116") {
        return null; // 주문을 찾을 수 없음
      }
      console.error("주문 조회 오류:", orderError);
      throw new Error("주문을 불러오는 중 오류가 발생했습니다.");
    }

    // 주문 상세 아이템 조회
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("주문 상세 조회 오류:", itemsError);
      throw new Error("주문 상세를 불러오는 중 오류가 발생했습니다.");
    }

    return {
      ...(order as Order),
      order_items: (orderItems || []) as any[],
    };
  } catch (error) {
    console.error("주문 상세 조회 중 예외 발생:", error);
    throw error;
  }
}

/**
 * 가격을 포맷팅하는 헬퍼 함수
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

