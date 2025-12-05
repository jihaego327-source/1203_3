/**
 * @file pagination.tsx
 * @description 페이지네이션 컴포넌트
 *
 * URL 쿼리 파라미터와 동기화된 페이지네이션 UI입니다.
 * 이전/다음 버튼과 페이지 번호를 제공합니다.
 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const searchParams = useSearchParams();

  // URL 생성 헬퍼 함수
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    
    return `/products${params.toString() ? `?${params.toString()}` : ""}`;
  };

  // 페이지 번호 생성 (최대 5개 페이지 번호 표시)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하인 경우 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 페이지 표시
      if (currentPage <= 3) {
        // 앞부분
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 뒷부분
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav className="flex flex-col items-center gap-4 mt-8" aria-label="페이지네이션">
      {/* 아이템 범위 표시 */}
      <p className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        {startItem}-{endItem} / 총 {totalItems}개
      </p>

      {/* 페이지네이션 버튼 */}
      <div className="flex items-center gap-2" role="list">
        {/* 이전 버튼 */}
        <Link href={createPageUrl(currentPage - 1)}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            이전
          </Button>
        </Link>

        {/* 페이지 번호 */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400 dark:text-gray-600"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <Link key={pageNum} href={createPageUrl(pageNum)}>
                <Button
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  aria-label={`페이지 ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        <Link href={createPageUrl(currentPage + 1)}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            다음
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}

