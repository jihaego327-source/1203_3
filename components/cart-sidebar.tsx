/**
 * @file cart-sidebar.tsx
 * @description 장바구니 사이드 패널 컴포넌트
 *
 * CartButton 클릭 시 오른쪽에서 slide-in 되는 사이드 패널입니다.
 * 장바구니 아이템 목록과 총합을 표시합니다.
 *
 * @dependencies
 * - @/components/ui/dialog: Dialog 컴포넌트
 * - @/components/cart-item-list: CartItemList 컴포넌트
 */

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [total, setTotal] = useState({ subtotal: 0, itemCount: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // 장바구니 총액 가져오기
      fetch("/api/cart/total")
        .then((res) => res.json())
        .then((data) => setTotal(data))
        .catch(() => {});
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 사이드 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              장바구니
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="장바구니 닫기"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 장바구니 아이템 목록 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                장바구니 미리보기
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                장바구니 페이지에서 전체 목록을 확인하세요.
              </p>
              {total.itemCount > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    총 {total.itemCount}개 상품
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {formatPrice(total.subtotal)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {total.itemCount > 0 && (
              <div className="flex justify-between items-center pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">총액:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(total.subtotal)}
                </span>
              </div>
            )}
            <Link href="/cart" onClick={onClose} className="block">
              <Button className="w-full" size="lg">
                장바구니로 이동
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

