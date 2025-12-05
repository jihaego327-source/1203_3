/**
 * @file loading.tsx
 * @description 로딩 상태 UI 컴포넌트
 *
 * 스켈레톤 UI와 스피너 컴포넌트를 제공합니다.
 */

import { cn } from "@/lib/utils";

/**
 * 스켈레톤 UI 컴포넌트
 * 로딩 중인 콘텐츠의 플레이스홀더로 사용됩니다.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
}

/**
 * 스피너 컴포넌트
 * 로딩 중임을 나타내는 회전하는 아이콘입니다.
 */
export function Spinner({
  className,
  size = "md",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="로딩 중"
      {...props}
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

/**
 * 상품 카드 스켈레톤
 * 상품 목록 페이지에서 사용됩니다.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="flex flex-col p-4 gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between mt-auto pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * 상품 그리드 스켈레톤
 * 여러 개의 상품 카드를 로딩할 때 사용됩니다.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 페이지 로딩 컴포넌트
 * 전체 페이지가 로딩 중일 때 사용됩니다.
 */
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    </div>
  );
}

