/**
 * @file order-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 주문할 상품 목록과 총액을 표시합니다.
 */

import type { CartItemWithProduct } from "@/lib/types/cart";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";

interface OrderSummaryProps {
  items: CartItemWithProduct[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        주문 요약
      </h2>

      {/* 상품 목록 */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start gap-4 pb-4 border-b last:border-b-0"
          >
            <div className="flex-1">
              <Link
                href={`/products/${item.product.id}`}
                className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.product.name}
              </Link>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formatPrice(item.product.price)} × {item.quantity}개
              </div>
            </div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* 총액 */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            총 주문 금액
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

