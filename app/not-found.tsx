import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, Search } from "lucide-react";

/**
 * @file not-found.tsx
 * @description 404 에러 페이지
 *
 * 사용자가 존재하지 않는 페이지에 접근했을 때 표시되는 페이지입니다.
 */

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 숫자 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100">
            404
          </h1>
        </div>

        {/* 메시지 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" aria-hidden="true" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ShoppingBag className="w-5 h-5 mr-2" aria-hidden="true" />
              상품 둘러보기
            </Button>
          </Link>
        </div>

        {/* 추가 도움말 */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            도움이 필요하신가요?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              상품 검색
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

