"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/**
 * @file hero-section.tsx
 * @description Hero 섹션 컴포넌트
 *
 * 홈페이지의 메인 Hero 섹션을 표시합니다.
 * 
 * 주요 기능:
 * 1. 시각적으로 강조된 타이틀과 서브텍스트
 * 2. CTA 버튼 (시작하기, GitHub 보기)
 * 3. Scroll Down 아이콘 (Product 섹션으로 스크롤)
 * 4. 신규 상품 보기 버튼
 *
 * @dependencies
 * - lucide-react: 아이콘
 * - @/components/ui/button: 버튼 컴포넌트
 */

export function HeroSection() {
  const scrollToProducts = () => {
    // Product 섹션 찾기
    const productsSection = document.querySelector('section[data-section="products"]') as HTMLElement;
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="flex items-center justify-center px-8 py-20 bg-gradient-to-b from-[#E0F2FF] to-[#FFFFFF] dark:from-gray-900 dark:to-gray-900 relative">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
        {/* 타이틀 (2줄 구성) */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight drop-shadow-sm">
          SaaS 앱 템플릿에<br />오신 것을 환영합니다
        </h1>
        {/* 서브텍스트 */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 dark:text-gray-400 leading-loose max-w-2xl">
          Next.js, Shadcn, Clerk, Supabase, TailwindCSS로 구동되는 완전한
          기능의 템플릿으로 다음 프로젝트를 시작하세요.
        </p>
        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            size="lg" 
            className="text-lg px-8 shadow-[0_0_8px_rgba(37,99,235,0.25)]"
          >
            시작하기
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub 보기
            </Link>
          </Button>
        </div>
        
        {/* Scroll Down 아이콘 및 신규 상품 보기 버튼 */}
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Scroll Down 아이콘 */}
          <button
            onClick={scrollToProducts}
            className="animate-bounce text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="아래로 스크롤"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
          
          {/* 신규 상품 보기 버튼 */}
          <Button
            variant="outline"
            onClick={scrollToProducts}
            className="mt-2"
          >
            신규 상품 보기
          </Button>
        </div>
      </div>
    </section>
  );
}

