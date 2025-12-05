/**
 * @file loading.tsx
 * @description 상품 상세 페이지 로딩 상태
 */

export default function ProductDetailLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 스켈레톤 */}
        <div className="mb-8">
          <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* 상품 정보 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 이미지 스켈레톤 */}
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

          {/* 정보 스켈레톤 */}
          <div className="flex flex-col gap-6">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div className="pt-4">
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

