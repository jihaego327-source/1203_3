/**
 * @file mobile-menu.tsx
 * @description 모바일 메뉴 컴포넌트
 *
 * 햄버거 아이콘을 클릭하면 slide-down 되는 모바일 메뉴입니다.
 * 모바일에서만 표시됩니다.
 *
 * @dependencies
 * - lucide-react: Menu, X 아이콘
 * - @/components/ui/button: Button 컴포넌트
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { CartButton } from "./cart-button";
import { ThemeToggle } from "./theme-toggle";
import { Package } from "lucide-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 햄버거 버튼 (모바일에서만 표시) */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 text-gray-900 dark:text-white"
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* 모바일 메뉴 패널 */}
      <div
        className={`fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {/* 네비게이션 링크 */}
          <nav className="space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              홈
            </Link>
            <Link
              href="/products"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              상품
            </Link>
            <SignedIn>
              <Link
                href="/orders"
                onClick={closeMenu}
                className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                주문 내역
              </Link>
            </SignedIn>
          </nav>

          {/* 구분선 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex items-center justify-between px-4">
              <ThemeToggle />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="px-4 py-2" onClick={closeMenu}>
                    로그인
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <CartButton />
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

