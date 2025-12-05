/**
 * @file product-options.tsx
 * @description 상품 옵션 선택 컴포넌트 (색상, 사이즈 등)
 *
 * 상품의 색상, 사이즈 등의 옵션을 선택할 수 있는 컴포넌트입니다.
 * hover 시 border-blue-500가 적용되고, 선택된 옵션은 강조 표시됩니다.
 *
 * @dependencies
 * - @/components/ui/button: Button 컴포넌트
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Option {
  id: string;
  label: string;
  value: string;
  available?: boolean;
}

interface ProductOptionsProps {
  type: "color" | "size" | "variant";
  options: Option[];
  selectedOption?: string;
  onSelect?: (optionId: string) => void;
  label?: string;
}

export function ProductOptions({
  type,
  options,
  selectedOption,
  onSelect,
  label,
}: ProductOptionsProps) {
  const [selected, setSelected] = useState(selectedOption || options[0]?.id);

  const handleSelect = (optionId: string) => {
    const option = options.find((opt) => opt.id === optionId);
    if (option && option.available !== false) {
      setSelected(optionId);
      onSelect?.(optionId);
    }
  };

  const displayLabel = label || (type === "color" ? "색상" : type === "size" ? "사이즈" : "옵션");

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {displayLabel}
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected === option.id;
          const isAvailable = option.available !== false;

          if (type === "color") {
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={!isAvailable}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 scale-110"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                } ${
                  !isAvailable
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                style={{
                  backgroundColor: option.value,
                }}
                aria-label={`${option.label} 선택`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <span className="flex items-center justify-center w-full h-full text-white text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          }

          return (
            <Button
              key={option.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleSelect(option.id)}
              disabled={!isAvailable}
              className={`transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "hover:border-blue-500"
              } ${
                !isAvailable
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-pressed={isSelected}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

