/**
 * @file product-action-bar.tsx
 * @description 상품 상세 페이지 Sticky 하단바
 *
 * 상품 상세 페이지 하단에 고정되는 액션 바입니다.
 * "장바구니 담기"와 "바로 구매" 버튼을 포함합니다.
 * 스크롤 다운 시 나타나는 애니메이션을 제공합니다.
 *
 * @dependencies
 * - @/components/ui/button: Button 컴포넌트
 * - @/components/add-to-cart-button: AddToCartButton 컴포넌트
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";
import { useUser } from "@clerk/nextjs";

interface ProductActionBarProps {
  productId: string;
  stockQuantity: number;
  price: number;
  quantity?: number;
}

export function ProductActionBar({
  productId,
  stockQuantity,
  price,
  quantity = 1,
}: ProductActionBarProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 300);
      setIsVisible(scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(productId, quantity);
      router.push("/cart");
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePurchase = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsPurchasing(true);
    try {
      await addToCart(productId, quantity);
      router.push("/checkout");
    } catch (error) {
      console.error("구매 오류:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const isOutOfStock = stockQuantity === 0;

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 ${
        isScrolled ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 {quantity}개
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {(price * quantity).toLocaleString()}원
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart || isPurchasing}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart ? "처리 중..." : "장바구니"}
            </Button>
            <Button
              size="lg"
              onClick={handlePurchase}
              disabled={isOutOfStock || isAddingToCart || isPurchasing}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {isPurchasing ? "처리 중..." : "바로 구매"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

