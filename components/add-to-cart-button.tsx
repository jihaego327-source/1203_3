/**
 * @file add-to-cart-button.tsx
 * @description 상품 상세 페이지용 장바구니 담기 버튼 컴포넌트
 *
 * 수량 선택 기능과 함께 장바구니에 상품을 추가하는 기능을 제공합니다.
 */

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  stockQuantity: number;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  stockQuantity,
  disabled = false,
}: AddToCartButtonProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addToCart(productId, quantity);
      // 성공 시 장바구니 페이지로 이동하거나 토스트 메시지 표시
      router.push("/cart");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "장바구니에 추가하는 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrease = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
      setError(null);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setError(null);
    }
  };

  const isOutOfStock = stockQuantity === 0;
  const isMaxQuantity = quantity >= stockQuantity;

  return (
    <div className="flex flex-col gap-4">
      {/* 수량 선택 */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          수량:
        </span>
        <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-none border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={handleDecrease}
            disabled={quantity <= 1 || isLoading}
            aria-label="수량 감소"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="w-12 text-center font-medium text-gray-900 dark:text-gray-100" aria-label={`수량: ${quantity}개`}>
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-none border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={handleIncrease}
            disabled={isMaxQuantity || isLoading}
            aria-label="수량 증가"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        {stockQuantity > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            재고: {stockQuantity}개
          </span>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 장바구니 담기 버튼 */}
      <Button
        size="lg"
        className="w-full"
        disabled={isOutOfStock || disabled || isLoading}
        onClick={handleAddToCart}
        aria-label={isOutOfStock ? "품절된 상품입니다" : `장바구니에 ${quantity}개 추가`}
      >
        {isLoading ? (
          "처리 중..."
        ) : isOutOfStock ? (
          "품절"
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            장바구니에 담기
          </>
        )}
      </Button>
    </div>
  );
}

