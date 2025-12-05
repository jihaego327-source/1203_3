"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/mobile-menu";
import { Package } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };

    // 초기 스크롤 위치 확인
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 서버와 클라이언트 초기 렌더링을 일치시키기 위해 마운트 전에는 항상 투명
  const shouldShowBackground = isMounted && isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm border-b transition-all duration-300 ${
        shouldShowBackground
          ? "bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700"
          : "bg-transparent border-transparent"
      }`}
      role="banner"
    >
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold" aria-label="홈으로 이동">
          SaaS Template
        </Link>
        {/* 데스크톱 메뉴 */}
        <div className={`hidden lg:flex gap-4 items-center transition-opacity duration-300 ${
          shouldShowBackground ? "opacity-100" : "opacity-90"
        }`}>
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="px-3 py-1.5 transition-all duration-300 hover:scale-105">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <CartButton />
            <Link href="/orders" aria-label="주문 내역">
              <Button
                variant="ghost"
                size="icon"
                aria-label="주문 내역 보기"
                className="transition-all duration-300 hover:scale-105"
              >
                <Package className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
        {/* 모바일 메뉴 */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
