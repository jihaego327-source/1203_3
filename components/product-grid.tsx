/**
 * @file product-grid.tsx
 * @description 상품 Grid 레이아웃 컴포넌트
 *
 * 상품 목록을 Grid 형태로 표시하는 컴포넌트입니다.
 * 반응형 디자인을 지원합니다 (모바일: 1열, 태블릿: 2열, 데스크톱: 3-4열).
 * 필터 변경 시 fade-in + scale 애니메이션을 제공합니다.
 */

"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";
import { useSearchParams } from "next/navigation";

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
    desktop = 4,
  } = columns || {};

  const searchParams = useSearchParams();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(products);

  // 필터 변경 감지 및 애니메이션
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayProducts(products);
      setIsAnimating(false);
    }, 150); // 애니메이션 시작 전 약간의 딜레이

    return () => clearTimeout(timer);
  }, [searchParams.toString(), products]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          표시할 상품이 없습니다.
        </p>
      </div>
    );
  }

  // 태블릿 Grid 클래스명
  const tabletClass = tablet === 2 
    ? "sm:grid-cols-2" 
    : tablet === 3 
    ? "sm:grid-cols-3" 
    : "sm:grid-cols-2";
  
  // 데스크톱 Grid 클래스명
  const desktopClass = desktop === 3
    ? "lg:grid-cols-3"
    : desktop === 4
    ? "lg:grid-cols-4"
    : "lg:grid-cols-3";

  // 모바일: scroll-snap-x 구조, 태블릿 이상: grid 구조
  return (
    <div
      className={`transition-all duration-300 ${
        isAnimating
          ? "opacity-0 scale-95"
          : "opacity-100 scale-100"
      }`}
    >
      {/* 모바일: 가로 스크롤 가능한 구조 */}
      <div className="flex sm:hidden overflow-x-auto scroll-snap-type-x-mandatory snap-x gap-4 pb-4 -mx-4 px-4">
        {displayProducts.map((product, index) => (
          <div key={product.id} className="min-w-[280px] flex-shrink-0">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
      
      {/* 태블릿 이상: Grid 구조 */}
      <div className={`hidden sm:grid gap-4 sm:gap-6 ${tabletClass} ${desktopClass}`}>
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}

