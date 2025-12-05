/**
 * @file recommended-product-card.tsx
 * @description 오늘의 추천 상품 카드 컴포넌트
 *
 * 연한 블루/그레이 톤의 배경을 가진 추천 상품 카드입니다.
 * 일반 상품 카드와 다른 디자인으로 추천 상품을 강조합니다.
 *
 * @dependencies
 * - @/lib/types/product: Product 타입
 * - @/lib/utils/format: formatPrice 함수
 */

import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/format";

interface RecommendedProductCardProps {
  product: Product;
}

export function RecommendedProductCard({ product }: RecommendedProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col rounded-lg overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-[#F9FAFB] dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
      aria-label={`${product.name} 상품 상세 보기`}
    >
      {/* 상품 정보 */}
      <div className="flex flex-col gap-3">
        {/* 카테고리 */}
        {product.category && (
          <span className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium">
            {product.category}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* 설명 */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(product.price)}
          </span>
          {product.stock_quantity > 0 ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              재고 {product.stock_quantity}개
            </span>
          ) : (
            <span className="text-xs text-red-500">품절</span>
          )}
        </div>
      </div>
    </Link>
  );
}

