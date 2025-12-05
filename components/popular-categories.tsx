/**
 * @file popular-categories.tsx
 * @description 인기 카테고리 섹션 컴포넌트
 *
 * Hero 바로 아래에 배치되는 인기 카테고리 섹션입니다.
 * 아이콘 또는 미니 카드 형태로 4-6개 카테고리를 표시하고,
 * 클릭 시 해당 카테고리 필터링된 상품 페이지로 이동합니다.
 *
 * @dependencies
 * - lucide-react: 아이콘
 * - next/link: 링크 네비게이션
 */

"use client";

import Link from "next/link";
import {
  Shirt,
  Sparkles,
  Laptop,
  Book,
  Home,
  Heart,
  type LucideIcon,
} from "lucide-react";

interface CategoryItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

// 카테고리 아이콘 매핑
const categoryIcons: Record<string, LucideIcon> = {
  fashion: Shirt,
  beauty: Sparkles,
  tech: Laptop,
  books: Book,
  home: Home,
  health: Heart,
};

interface PopularCategoriesProps {
  categories: string[];
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
  // 최대 6개 카테고리로 제한
  const displayCategories = categories.slice(0, 6);

  // 카테고리 아이템 생성
  const categoryItems: CategoryItem[] = displayCategories.map((category) => {
    const Icon = categoryIcons[category.toLowerCase()] || Home;
    return {
      name: category,
      icon: Icon,
      href: `/products?category=${encodeURIComponent(category)}`,
    };
  });

  // 카테고리가 없을 경우 기본 카테고리 표시
  const defaultCategories: CategoryItem[] = [
    { name: "Fashion", icon: Shirt, href: "/products?category=Fashion" },
    { name: "Beauty", icon: Sparkles, href: "/products?category=Beauty" },
    { name: "Tech", icon: Laptop, href: "/products?category=Tech" },
    { name: "Books", icon: Book, href: "/products?category=Books" },
  ];

  const items = categoryItems.length > 0 ? categoryItems : defaultCategories;

  return (
    <section className="w-full bg-[#EFF6FF] dark:bg-gray-800 py-12 px-8">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          인기 카테고리
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
              aria-label={`${item.name} 카테고리 보기`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300 mb-3">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-center">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

