/**
 * @file error.tsx
 * @description 상품 상세 페이지 에러 상태
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("상품 상세 페이지 에러:", error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            상품 정보를 불러오는 중 오류가 발생했습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {error.message || "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
          </p>
          <div className="flex gap-4 mt-6">
            <Button onClick={reset} variant="default">
              다시 시도
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">상품 목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

