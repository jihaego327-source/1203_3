/**
 * @file product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * 클릭 시 상품 상세 페이지로 이동합니다.
 * hover 시 장바구니 담기 버튼이 나타납니다.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/format";
import { addToCart } from "@/lib/actions/cart";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * 상품의 태그 타입 결정 (NEW, BEST, SALE)
 */
function getProductTag(product: Product): "NEW" | "BEST" | "SALE" | null {
  const now = new Date();
  const createdAt = new Date(product.created_at);
  const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  
  // NEW: 생성일이 7일 이내
  if (daysSinceCreation <= 7) {
    return "NEW";
  }
  
  // BEST: 재고가 많거나 가격이 높은 상품 (임시 로직)
  if (product.stock_quantity > 50 || product.price > 50000) {
    return "BEST";
  }
  
  // SALE: 현재는 구현하지 않음 (추후 확장 가능)
  return null;
}

/**
 * 할인율 계산 (임시 로직)
 * 실제로는 Product 타입에 original_price 또는 discount_percentage 필드가 있어야 함
 */
function calculateDiscountPercentage(product: Product): number | null {
  // 임시 로직: 가격이 30000원 이상인 상품에 대해 10-30% 할인 시뮬레이션
  if (product.price >= 30000) {
    // 가격에 따라 다른 할인율 적용
    if (product.price >= 100000) {
      return 30;
    } else if (product.price >= 50000) {
      return 20;
    } else {
      return 10;
    }
  }
  return null;
}

/**
 * 원래 가격 계산 (할인율 기반)
 */
function getOriginalPrice(product: Product): number | null {
  const discountPercent = calculateDiscountPercentage(product);
  if (discountPercent === null) return null;
  
  return Math.round(product.price / (1 - discountPercent / 100));
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const tag = getProductTag(product);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const discountPercent = calculateDiscountPercentage(product);
  const originalPrice = getOriginalPrice(product);

  // Intersection Observer로 스크롤 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // 한 번만 트리거되도록 관찰 중단
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      // 성공 시 간단한 피드백 (추후 토스트로 개선 가능)
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={`group flex flex-col rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300 relative scroll-snap-align-start ${
        isVisible
          ? "animate-in fade-in slide-in-from-bottom-4 duration-500"
          : "opacity-0"
      }`}
      style={
        isVisible
          ? {
              animationDelay: `${Math.min(index * 75, 300)}ms`,
            }
          : undefined
      }
    >
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col h-full"
        aria-label={`${product.name} 상품 상세 보기`}
      >
      {/* Gradient border wrapper */}
      <div className="p-[1px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg relative">
        {/* 카테고리 태그 */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
          {discountPercent && (
            <span className="px-2 py-1 text-xs font-bold rounded-md bg-red-500 text-white">
              {discountPercent}% 할인
            </span>
          )}
          {tag && (
            <span
              className={`px-2 py-1 text-xs font-bold rounded-md ${
                tag === "NEW"
                  ? "bg-green-500 text-white"
                  : tag === "BEST"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {tag}
            </span>
          )}
        </div>
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full">

          {/* 이미지 영역 (placeholder) */}
          <div 
            className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 cursor-pointer rounded-md shadow-md"
            role="img"
            aria-label={`${product.name} 상품 이미지`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-md" />
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium relative z-10">
              이미지
            </span>
            
            {/* Hover 시 담기 버튼 */}
            <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/70 dark:bg-black/80 backdrop-blur-sm">
              <Button
                size="sm"
                className="w-full rounded-none bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock_quantity === 0}
                aria-label={`${product.name} 장바구니에 담기`}
              >
                {isAddingToCart ? (
                  "처리 중..."
                ) : product.stock_quantity === 0 ? (
                  "품절"
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    담기
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 상품 정보 영역 */}
          <div className="flex flex-col p-4 gap-2">
            {/* 카테고리 */}
            {product.category && (
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {product.category}
              </span>
            )}

            {/* 상품명 */}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>

            {/* 설명 (선택적) */}
            {product.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* 가격 및 재고 */}
            <div className="flex flex-col gap-1 mt-auto pt-2">
              <div className="flex items-center gap-2">
                {originalPrice ? (
                  <>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.stock_quantity > 0 ? (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  재고 {product.stock_quantity}개
                </span>
              ) : (
                <span className="text-xs text-red-500">품절</span>
              )}
            </div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}

