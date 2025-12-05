/**
 * @file category-section.tsx
 * @description 카테고리별 상품 섹션 컴포넌트
 *
 * 특정 카테고리의 대표 상품들을 표시하고 "더보기" 버튼으로
 * 해당 카테고리 필터링된 상품 목록 페이지로 이동할 수 있습니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./product-grid";
import type { Product } from "@/lib/types/product";

interface CategorySectionProps {
  category: string;
  products: Product[];
  limit?: number;
}

export function CategorySection({
  category,
  products,
  limit = 6,
}: CategorySectionProps) {
  const displayedProducts = products.slice(0, limit);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section className="px-8 py-12 lg:py-20 bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold capitalize">
            {category}
          </h2>
          <Link href={`/products?category=${category}`}>
            <Button variant="outline">
              더보기
            </Button>
          </Link>
        </div>
        <ProductGrid
          products={displayedProducts}
          columns={{
            mobile: 1,
            tablet: 2,
            desktop: 4,
          }}
        />
      </div>
    </section>
  );
}

