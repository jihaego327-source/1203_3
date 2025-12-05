/**
 * @file cart-item-card.tsx
 * @description 장바구니 아이템 카드 컴포넌트
 *
 * 장바구니 아이템의 정보를 표시하고, 수량 조절 및 삭제 기능을 제공합니다.
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemWithProduct } from "@/lib/types/cart";
import { formatPrice } from "@/lib/utils/format";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartItemCardProps {
  item: CartItemWithProduct;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock_quantity) {
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await updateCartItem(item.id, newQuantity);
      setQuantity(newQuantity);
      router.refresh(); // 페이지 새로고침하여 총액 업데이트
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "수량 변경 중 오류가 발생했습니다.";
      setError(errorMessage);
      setQuantity(item.quantity); // 원래 수량으로 복원
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("정말 이 상품을 장바구니에서 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await removeFromCart(item.id);
      router.refresh(); // 페이지 새로고침
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleIncrease = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    handleQuantityChange(quantity - 1);
  };

  const itemTotal = item.product.price * quantity;
  const isMaxQuantity = quantity >= item.product.stock_quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      {/* 상품 이미지 및 정보 */}
      <Link
        href={`/products/${item.product.id}`}
        className="flex flex-1 gap-4 hover:opacity-80 transition-opacity"
        aria-label={`${item.product.name} 상품 상세 보기`}
      >
        {/* 이미지 영역 */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-gray-500">이미지</span>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {item.product.name}
          </h3>
          {item.product.category && (
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {item.product.category}
            </span>
          )}
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(item.product.price)}
          </div>
        </div>
      </Link>

      {/* 수량 조절 및 삭제 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* 수량 조절 */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">수량</span>
          <div className="flex items-center gap-2 border rounded-md">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isUpdating || isDeleting}
              aria-label="수량 감소"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="w-10 text-center font-medium" aria-label={`수량: ${quantity}개`}>
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={handleIncrease}
              disabled={isMaxQuantity || isUpdating || isDeleting}
              aria-label="수량 증가"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          {item.product.stock_quantity > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              재고: {item.product.stock_quantity}개
            </span>
          )}
        </div>

        {/* 총액 및 삭제 버튼 */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(itemTotal)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isDeleting || isUpdating}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label={`${item.product.name} 장바구니에서 삭제`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span className="ml-2">삭제</span>
          </Button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="col-span-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

