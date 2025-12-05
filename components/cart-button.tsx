/**
 * @file cart-button.tsx
 * @description Navbar에 표시될 장바구니 버튼 컴포넌트
 *
 * 장바구니 아이템 개수를 배지로 표시하고, 클릭 시 장바구니 페이지로 이동합니다.
 */

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function CartButton() {
  const { isSignedIn } = useUser();
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    async function fetchCartCount() {
      try {
        const response = await fetch("/api/cart/count");
        if (response.ok) {
          const data = await response.json();
          setItemCount(data.itemCount || 0);
        }
      } catch (error) {
        console.error("장바구니 개수 조회 오류:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartCount();

    // 주기적으로 장바구니 개수 갱신 (5초마다)
    const interval = setInterval(fetchCartCount, 5000);

    return () => clearInterval(interval);
  }, [isSignedIn]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <Link href="/cart" aria-label="장바구니">
      <Button 
        variant="outline" 
        size="icon" 
        className="relative"
        aria-label={`장바구니 (${itemCount}개)`}
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {!isLoading && itemCount > 0 && (
          <span 
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            aria-label={`장바구니 아이템 ${itemCount}개`}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}

