/**
 * @file star-rating.tsx
 * @description 별점 표시 컴포넌트
 *
 * CSS transition 기반의 별점 애니메이션을 제공합니다.
 * hover 시 별점이 부드럽게 나타나는 효과를 구현합니다.
 *
 * @dependencies
 * - lucide-react: Star 아이콘
 */

"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showRating = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayRating = interactive ? selectedRating : rating;
  const activeRating = hoveredRating || displayRating;

  const handleClick = (value: number) => {
    if (interactive) {
      setSelectedRating(value);
      onRatingChange?.(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= activeRating;
          const isHalf = starValue - 0.5 === activeRating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoveredRating(starValue)}
              onMouseLeave={() => interactive && setHoveredRating(0)}
              disabled={!interactive}
              className={`transition-all duration-300 ${
                interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
              } ${isFilled ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
              aria-label={`${starValue}점`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled ? "fill-current" : ""
                } transition-all duration-300`}
              />
            </button>
          );
        })}
      </div>
      {showRating && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayRating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
}

