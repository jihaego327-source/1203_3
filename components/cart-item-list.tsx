/**
 * @file cart-item-list.tsx
 * @description 장바구니 아이템 목록 컴포넌트
 *
 * 장바구니 아이템들을 표시하고, 실시간 총액 업데이트를 제공합니다.
 * 수량 변경 시 총합이 부드럽게 업데이트되는 애니메이션을 포함합니다.
 */

"use client";

import { useState, useEffect } from "react";
import { CartItemCard } from "./cart-item-card";
import type { CartItemWithProduct } from "@/lib/types/cart";
import { formatPrice } from "@/lib/utils/format";

interface CartItemListProps {
  items: CartItemWithProduct[];
  showTotal?: boolean;
}

export function CartItemList({ items, showTotal = false }: CartItemListProps) {
  const [total, setTotal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 총합 계산
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    if (newTotal !== total) {
      setIsAnimating(true);
      setTotal(newTotal);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [items, total]);

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
      {showTotal && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              총합:
            </span>
            <span
              className={`text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300 ${
                isAnimating ? "scale-110 text-blue-600 dark:text-blue-400" : ""
              }`}
            >
              {formatPrice(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

