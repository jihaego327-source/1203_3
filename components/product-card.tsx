/**
 * @file product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * 클릭 시 상품 상세 페이지로 이동합니다.
 */

import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/format";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
      aria-label={`${product.name} 상품 상세 보기`}
    >
      {/* 이미지 영역 (placeholder) */}
      <div 
        className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
        role="img"
        aria-label={`${product.name} 상품 이미지`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800" />
        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
          이미지
        </span>
      </div>

      {/* 상품 정보 영역 */}
      <div className="flex flex-col p-4 gap-2">
        {/* 카테고리 */}
        {product.category && (
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {product.category}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* 설명 (선택적) */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
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

