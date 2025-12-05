/**
 * @file recommended-section.tsx
 * @description 오늘의 추천 섹션 컴포넌트
 *
 * 스크롤 위치에 따라 추천 문구가 fade-up 애니메이션으로 나타나는 섹션입니다.
 * Intersection Observer를 사용하여 뷰포트 진입 시 애니메이션을 트리거합니다.
 *
 * @dependencies
 * - @/components/recommended-product-card: RecommendedProductCard 컴포넌트
 * - @/lib/types/product: Product 타입
 */

"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/lib/types/product";
import { RecommendedProductCard } from "./recommended-product-card";

interface RecommendedSectionProps {
  products: Product[];
  title?: string;
}

export function RecommendedSection({
  products,
  title = "오늘의 추천",
}: RecommendedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`px-8 py-12 lg:py-20 bg-white dark:bg-gray-900 transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product, index) => (
            <div
              key={product.id}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <RecommendedProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

