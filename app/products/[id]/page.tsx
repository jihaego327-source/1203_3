/**
 * @file page.tsx
 * @description 상품 상세 페이지
 *
 * 단일 상품의 상세 정보를 표시하는 페이지입니다.
 * 재고, 가격, 설명 등을 보여주며, 추후 장바구니에 담기 기능이 추가될 예정입니다.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProductById, getProducts } from "@/lib/actions/products";
import { formatPrice } from "@/lib/utils/format";
import { ProductGrid } from "@/components/product-grid";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다",
    };
  }

  return {
    title: product.name,
    description: product.description || `${product.name} 상품 상세 페이지`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // 관련 상품 추천 (같은 카테고리의 다른 상품 4개)
  let relatedProducts = [];
  if (product.category) {
    try {
      const allProducts = await getProducts(5, { category: product.category });
      relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
    } catch (error) {
      console.error("관련 상품 조회 오류:", error);
    }
  }

  const isInStock = product.stock_quantity > 0;

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Link href="/products" className="inline-block mb-8">
          <Button variant="outline" size="sm">
            ← 상품 목록으로
          </Button>
        </Link>

        {/* 상품 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 이미지 영역 */}
          <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                상품 이미지
              </span>
            </div>
          </div>

          {/* 상품 정보 영역 */}
          <div className="flex flex-col gap-6">
            {/* 카테고리 */}
            {product.category && (
              <Link
                href={`/products?category=${product.category}`}
                className="inline-block"
              >
                <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wide">
                  {product.category}
                </span>
              </Link>
            )}

            {/* 상품명 */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {product.name}
            </h1>

            {/* 가격 */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* 재고 상태 */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    재고:
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {product.stock_quantity}개 남음
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-red-500">
                  품절
                </span>
              )}
            </div>

            {/* 설명 */}
            {product.description && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  상품 설명
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* 장바구니 버튼 */}
            <div className="pt-4">
              <AddToCartButton
                productId={product.id}
                stockQuantity={product.stock_quantity}
                disabled={!isInStock}
              />
            </div>
          </div>
        </div>

        {/* 관련 상품 섹션 */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
              관련 상품
            </h2>
            <ProductGrid
              products={relatedProducts}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 4,
              }}
            />
          </section>
        )}
      </div>
    </main>
  );
}

