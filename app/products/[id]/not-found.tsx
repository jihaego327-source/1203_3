/**
 * @file not-found.tsx
 * @description 상품을 찾을 수 없을 때 표시되는 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            상품을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            요청하신 상품이 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <div className="flex gap-4 mt-6">
            <Button asChild variant="default">
              <Link href="/products">상품 목록으로 돌아가기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

