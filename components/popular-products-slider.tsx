/**
 * @file popular-products-slider.tsx
 * @description 인기 상품 가로 슬라이드 컴포넌트
 *
 * "지금 인기 있는 상품" 섹션을 가로 스크롤 가능한 슬라이드로 표시합니다.
 * scroll-snap-x를 사용하여 부드러운 스크롤 경험을 제공합니다.
 * 하단에 progress dot 애니메이션을 포함합니다.
 *
 * @dependencies
 * - @/components/product-card: ProductCard 컴포넌트
 * - @/lib/types/product: Product 타입
 */

"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";

interface PopularProductsSliderProps {
  products: Product[];
  title?: string;
}

export function PopularProductsSlider({
  products,
  title = "지금 인기 있는 상품",
}: PopularProductsSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 위치에 따른 현재 인덱스 계산
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.querySelector("div")?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setCurrentIndex(newIndex);
      setIsScrolled(scrollLeft > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [products]);

  // 카드 너비 계산 (모바일: 280px, 데스크톱: 자동)
  const cardWidth = 280;
  const gap = 16;
  const visibleCards = typeof window !== "undefined" && window.innerWidth >= 640 ? 4 : 1;
  const totalCards = products.length;
  const maxIndex = Math.max(0, totalCards - visibleCards);

  return (
    <section className="px-8 py-12 lg:py-20 bg-[#F9FAFB] dark:bg-gray-800">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>

        {/* 가로 스크롤 컨테이너 */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scroll-snap-type-x-mandatory snap-x gap-4 pb-4 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[300px] flex-shrink-0 scroll-snap-align-start"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        {totalCards > visibleCards && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = 280;
                    const gap = 16;
                    container.scrollTo({
                      left: index * (cardWidth + gap),
                      behavior: "smooth",
                    });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-600 dark:bg-blue-400"
                    : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

