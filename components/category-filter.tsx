/**
 * @file category-filter.tsx
 * @description 카테고리 필터 컴포넌트
 *
 * URL 쿼리 파라미터와 동기화된 카테고리 필터 UI입니다.
 * "전체" 옵션과 각 카테고리 버튼을 제공합니다.
 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // URL 생성 헬퍼 함수
  const createUrl = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    // 페이지네이션과 함께 사용 시 첫 페이지로 리셋
    params.delete("page");
    
    return `/products${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <nav className="flex flex-wrap gap-2" aria-label="카테고리 필터">
      {/* 전체 버튼 */}
      <Link href={createUrl(null)}>
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          aria-label="전체 상품 보기"
          aria-pressed={selectedCategory === null}
        >
          전체
        </Button>
      </Link>

      {/* 카테고리 버튼들 */}
      {categories.map((category) => (
        <Link key={category} href={createUrl(category)}>
          <Button
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            aria-label={`${category} 카테고리 상품 보기`}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </Button>
        </Link>
      ))}
    </nav>
  );
}

