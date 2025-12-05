/**
 * @file sort-selector.tsx
 * @description 정렬 선택 컴포넌트
 *
 * URL 쿼리 파라미터와 동기화된 정렬 선택 UI입니다.
 * 드롭다운 형태로 정렬 옵션을 제공합니다.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ProductSortOption } from "@/lib/types/product";

const sortOptions: Array<{
  value: ProductSortOption;
  label: string;
}> = [
  { value: "created_at_desc", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
];

export function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as ProductSortOption) || "created_at_desc";

  const handleSortChange = (sort: ProductSortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sort === "created_at_desc") {
      // 기본값이면 파라미터에서 제거
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    
    // 페이지네이션과 함께 사용 시 첫 페이지로 리셋
    params.delete("page");
    
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          정렬:
        </span>
        <div className="flex gap-1 flex-wrap">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

