import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiSupabaseFill } from "react-icons/ri";
import { ProductGrid } from "@/components/product-grid";
import { CategorySection } from "@/components/category-section";
import { getProducts, getCategories } from "@/lib/actions/products";

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
      {/* 히어로 섹션 */}
      <section className="flex items-center px-8 py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-center">
          {/* 좌측: 환영 메시지 */}
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              SaaS 앱 템플릿에 오신 것을 환영합니다
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Next.js, Shadcn, Clerk, Supabase, TailwindCSS로 구동되는 완전한
              기능의 템플릿으로 다음 프로젝트를 시작하세요.
            </p>
          </div>

          {/* 우측: 버튼 두 개 세로 정렬 */}
          <div className="flex flex-col gap-6">
            <Link href="/storage-test" className="w-full">
              <Button className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow">
                <RiSupabaseFill className="w-8 h-8" />
                <span>Storage 파일 업로드 테스트</span>
              </Button>
            </Link>
            <Link href="/auth-test" className="w-full">
              <Button
                className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow"
                variant="outline"
              >
                <RiSupabaseFill className="w-8 h-8" />
                <span>Clerk + Supabase 인증 연동</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 상품 목록 섹션 */}
      {featuredProducts.length > 0 && (
        <section className="px-8 py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
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
