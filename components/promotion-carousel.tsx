/**
 * @file promotion-carousel.tsx
 * @description 프로모션 배너 Carousel 컴포넌트
 *
 * 슬라이드형 Carousel로 프로모션 배너를 표시합니다.
 * 각 슬라이드에는 상품 이미지를 배경으로 사용하고, 반투명 화이트 오버레이를 적용합니다.
 * 자동 슬라이드와 수동 네비게이션을 지원합니다.
 *
 * 주요 기능:
 * 1. 자동 슬라이드 (5초 간격)
 * 2. 좌우 화살표 버튼으로 수동 네비게이션
 * 3. 하단 도트 인디케이터
 * 4. 터치 스와이프 지원 (모바일)
 * 5. 스크롤 시 Hero 축소 애니메이션
 *
 * @dependencies
 * - lucide-react: 아이콘
 * - @/components/ui/button: 버튼 컴포넌트
 * - @/lib/types/product: Product 타입
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types/product";

interface PromotionCarouselProps {
  products: Product[];
}

export function PromotionCarousel({ products }: PromotionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 최대 5개 슬라이드로 제한
  const slides = products.slice(0, 5);

  // 슬라이드가 없을 경우 기본 슬라이드 생성
  const hasSlides = slides.length > 0;
  const defaultSlides: (Product | { id: string; name: string; description: string })[] = 
    hasSlides 
      ? slides 
      : [
          { id: "default-1", name: "새로운 쇼핑 경험", description: "최고의 상품을 만나보세요" },
          { id: "default-2", name: "특별한 혜택", description: "지금 바로 확인하세요" },
        ];

  // 자동 슬라이드
  useEffect(() => {
    if (defaultSlides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultSlides.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [defaultSlides.length]);

  // 스크롤 애니메이션
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 (다음 슬라이드)
        goToNext();
      } else {
        // 오른쪽으로 스와이프 (이전 슬라이드)
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultSlides.length);
    // 자동 슬라이드 재시작
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultSlides.length);
    }, 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + defaultSlides.length) % defaultSlides.length);
    // 자동 슬라이드 재시작
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultSlides.length);
    }, 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // 자동 슬라이드 재시작
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultSlides.length);
    }, 5000);
  };

  return (
    <section
      className={`relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden transition-transform duration-300 ${
        isScrolled ? "scale-[0.98]" : "scale-100"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 슬라이드 컨테이너 */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {defaultSlides.map((slide, index) => {
          const product = hasSlides ? (slide as Product) : null;
          const defaultSlide = hasSlides ? null : (slide as { id: string; name: string; description: string });
          const displayName = product?.name || defaultSlide?.name || "새로운 쇼핑 경험";
          const displayDescription = product?.description || defaultSlide?.description || null;
          
          return (
            <div
              key={product?.id || defaultSlide?.id || index}
              className="min-w-full h-full relative flex items-center justify-center"
            >
              {/* 배경 이미지 (상품 이미지가 있으면 사용, 없으면 패턴) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
              >
                {/* 패턴 오버레이 */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px]" />
                </div>
              </div>

              {/* 반투명 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F1] to-[#F6F0FF] opacity-60 dark:opacity-40" />

              {/* 콘텐츠 */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-8 text-center">
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
                    {displayName}
                  </h2>
                  {displayDescription && (
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl">
                      {displayDescription}
                    </p>
                  )}

                  {/* CTA 버튼 */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <Link href="/products">지금 쇼핑하기</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
                      asChild
                    >
                      <Link href="/products?sort=created_at_desc">신상품 보기</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 좌우 화살표 버튼 */}
      {defaultSlides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        </>
      )}

      {/* 하단 도트 인디케이터 */}
      {defaultSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {defaultSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

