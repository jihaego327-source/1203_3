import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import { CategorySection } from "@/components/category-section";
import { getProducts, getCategories } from "@/lib/actions/products";
import { PromotionBar } from "@/components/promotion-bar";
import { PromotionCarousel } from "@/components/promotion-carousel";
import { PopularCategories } from "@/components/popular-categories";
import { WaveDivider } from "@/components/wave-divider";

export default async function Home() {
  // 최신 상품 8개 가져오기 (에러 발생 시 빈 배열 반환)
  let featuredProducts = [];
  let categories: string[] = [];
  const categoryProducts: Record<string, any[]> = {};

  try {
    featuredProducts = await getProducts(8);
    categories = await getCategories();

    // 각 카테고리별로 대표 상품 6개씩 가져오기
    const categoryPromises = categories.map(async (category) => {
      try {
        const products = await getProducts(6, { category });
        return { category, products };
      } catch (error) {
        console.error(`카테고리 ${category} 상품 조회 오류:`, error);
        return { category, products: [] };
      }
    });

    const results = await Promise.all(categoryPromises);
    results.forEach(({ category, products }) => {
      if (products.length > 0) {
        categoryProducts[category] = products;
      }
    });
  } catch (error) {
    console.error("홈페이지 상품 조회 오류:", error);
    // 에러가 발생해도 홈페이지는 표시됨
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* 혜택 문구 Bar */}
      <PromotionBar />

      {/* 프로모션 배너 Carousel */}
      <PromotionCarousel products={featuredProducts.slice(0, 5)} />

      {/* 인기 카테고리 섹션 */}
      <PopularCategories categories={categories} />

      {/* Wave Divider */}
      <WaveDivider />

      {/* 상품 목록 섹션 */}
      {featuredProducts.length > 0 && (
        <section data-section="products" className="px-8 py-12 lg:py-20 bg-[#F9FAFB] dark:bg-gray-900">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold">
                인기 상품
              </h2>
              <Link href="/products">
                <Button variant="outline">
                  더보기
                </Button>
              </Link>
            </div>
            <ProductGrid 
              products={featuredProducts}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 4,
              }}
            />
          </div>
        </section>
      )}

      {/* 카테고리별 섹션 */}
      {Object.entries(categoryProducts).map(([category, products]) => (
        <CategorySection
          key={category}
          category={category}
          products={products}
          limit={6}
        />
      ))}
    </main>
  );
}
