/**
 * @file product-grid.tsx
 * @description 상품 Grid 레이아웃 컴포넌트
 *
 * 상품 목록을 Grid 형태로 표시하는 컴포넌트입니다.
 * 반응형 디자인을 지원합니다 (모바일: 1열, 태블릿: 2열, 데스크톱: 3-4열).
 */

import type { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4;
  };
}

export function ProductGrid({ products, columns }: ProductGridProps) {
  const {
    mobile = 1,
    tablet = 2,
    desktop = 3,
  } = columns || {};

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          표시할 상품이 없습니다.
        </p>
      </div>
    );
  }

  // Grid 열 수에 따른 클래스명 조합
  const getGridClassName = () => {
    const base = "grid gap-4 sm:gap-6";
    
    // 모바일
    const mobileClass = mobile === 1 ? "grid-cols-1" : mobile === 2 ? "grid-cols-2" : "grid-cols-1";
    
    // 태블릿
    const tabletClass = tablet === 2 
      ? "sm:grid-cols-2" 
      : tablet === 3 
      ? "sm:grid-cols-3" 
      : "sm:grid-cols-2";
    
    // 데스크톱
    const desktopClass = desktop === 3
      ? "lg:grid-cols-3"
      : desktop === 4
      ? "lg:grid-cols-4"
      : "lg:grid-cols-3";

    return `${base} ${mobileClass} ${tabletClass} ${desktopClass}`;
  };

  return (
    <div className={getGridClassName()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

