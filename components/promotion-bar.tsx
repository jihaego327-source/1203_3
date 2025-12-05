/**
 * @file promotion-bar.tsx
 * @description 상단 혜택 문구 Bar 컴포넌트
 *
 * 홈페이지 상단에 고정된 작은 Bar 형태로 주요 혜택 문구를 표시합니다.
 * "무료배송", "신상품 업데이트" 등의 정보를 슬라이드 형태로 표시합니다.
 *
 * @dependencies
 * - lucide-react: 아이콘
 */

"use client";

import { useState, useEffect } from "react";
import { Truck, Sparkles, Gift, Shield } from "lucide-react";

interface PromotionItem {
  icon: React.ReactNode;
  text: string;
}

const promotions: PromotionItem[] = [
  { icon: <Truck className="w-4 h-4" />, text: "무료배송" },
  { icon: <Sparkles className="w-4 h-4" />, text: "신상품 업데이트" },
  { icon: <Gift className="w-4 h-4" />, text: "첫 구매 특가" },
  { icon: <Shield className="w-4 h-4" />, text: "안전한 결제" },
];

export function PromotionBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 3000); // 3초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-blue-600 dark:bg-blue-800 text-white py-2 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          <div 
            key={currentIndex}
            className="flex items-center gap-2 animate-in fade-in duration-500"
          >
            {promotions[currentIndex].icon}
            <span className="text-sm font-medium whitespace-nowrap">
              {promotions[currentIndex].text}
            </span>
          </div>
        </div>
      </div>
      
      {/* 인디케이터 도트 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-4"
                : "bg-white/50"
            }`}
            aria-label={`프로모션 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}

