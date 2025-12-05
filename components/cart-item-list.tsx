/**
 * @file cart-item-list.tsx
 * @description 장바구니 아이템 목록 컴포넌트
 *
 * 장바구니 아이템들을 표시하고, 실시간 총액 업데이트를 제공합니다.
 */

"use client";

import { CartItemCard } from "./cart-item-card";
import type { CartItemWithProduct } from "@/lib/types/cart";

interface CartItemListProps {
  items: CartItemWithProduct[];
}

export function CartItemList({ items }: CartItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          장바구니가 비어있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

