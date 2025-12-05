/**
 * @file page.tsx
 * @description 상품 목록 페이지
 *
 * 모든 상품을 Grid 레이아웃으로 표시하는 페이지입니다.
 * 카테고리 필터, 정렬, 페이지네이션 기능을 지원합니다.
 */

import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { CategoryFilter } from "@/components/category-filter";
import { SortSelector } from "@/components/sort-selector";
import { Pagination } from "@/components/pagination";
import { ProductGridSkeleton } from "@/components/loading";
import { EmptyProducts } from "@/components/empty-state";
import { getProducts, getCategories, getProductsCount } from "@/lib/actions/products";
import type { ProductSortOption } from "@/lib/types/product";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: ProductSortOption;
    page?: string;
  }>;
}

export const metadata = {
  title: "상품 목록",
  description: "모든 상품을 둘러보세요",
};

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const sortBy = params.sort || "created_at_desc";
  const currentPage = parseInt(params.page || "1", 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const filters = category ? { category } : undefined;

  // 카테고리, 상품 데이터, 총 개수를 병렬로 가져오기
  const [categories, products, totalCount] = await Promise.all([
    getCategories(),
    getProducts(ITEMS_PER_PAGE, filters, sortBy, offset),
    getProductsCount(filters),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            상품 목록
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              총 {totalCount}개의 상품
            </p>

            {/* 정렬 선택 */}
            <Suspense fallback={<div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
              <SortSelector />
            </Suspense>
          </div>

          {/* 카테고리 필터 */}
          <Suspense fallback={<div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <EmptyProducts />
        ) : (
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          {products.length === 0 ? (
            <EmptyProducts />
          ) : (
            <ProductGrid 
              products={products}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
              }}
            />
          )}
        </Suspense>
        )}

        {/* 페이지네이션 */}
        <Suspense fallback={<div className="h-16 w-full" />}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalCount}
          />
        </Suspense>
      </div>
    </main>
  );
}

