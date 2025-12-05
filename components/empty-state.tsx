/**
 * @file empty-state.tsx
 * @description 빈 상태 UI 컴포넌트
 *
 * 데이터가 없을 때 표시하는 재사용 가능한 빈 상태 컴포넌트입니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className
      )}
    >
      {Icon && (
        <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
      )}
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <Link href={action.href}>
          <Button>{action.label}</Button>
        </Link>
      )}
    </div>
  );
}

/**
 * 빈 장바구니 상태
 */
export function EmptyCart() {
  return (
    <EmptyState
      title="장바구니가 비어있습니다"
      description="장바구니에 담긴 상품이 없습니다. 상품을 둘러보고 장바구니에 추가해보세요."
      action={{
        label: "상품 둘러보기",
        href: "/products",
      }}
    />
  );
}

/**
 * 빈 주문 내역 상태
 */
export function EmptyOrders() {
  return (
    <EmptyState
      title="주문 내역이 없습니다"
      description="아직 주문하신 상품이 없습니다. 첫 주문을 시작해보세요."
      action={{
        label: "상품 둘러보기",
        href: "/products",
      }}
    />
  );
}

/**
 * 빈 상품 목록 상태
 */
export function EmptyProducts() {
  return (
    <EmptyState
      title="상품을 찾을 수 없습니다"
      description="검색 조건에 맞는 상품이 없습니다. 다른 조건으로 검색해보세요."
    />
  );
}

