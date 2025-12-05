/**
 * @file product-reviews.tsx
 * @description 상품 구매 후기 아코디언 컴포넌트
 *
 * 구매 후기 목록을 아코디언 형태로 표시합니다.
 * shadcn/ui Accordion 컴포넌트를 활용합니다.
 *
 * @dependencies
 * - @/components/ui/accordion: Accordion 컴포넌트
 * - @/components/star-rating: StarRating 컴포넌트
 */

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StarRating } from "./star-rating";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful?: number;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
}

// 임시 mock 데이터
const mockReviews: Review[] = [
  {
    id: "1",
    author: "김**",
    rating: 5,
    date: "2024-01-15",
    content: "정말 만족스러운 상품입니다. 품질도 좋고 배송도 빠르네요!",
    helpful: 12,
  },
  {
    id: "2",
    author: "이**",
    rating: 4,
    date: "2024-01-10",
    content: "가격 대비 품질이 좋습니다. 추천해요!",
    helpful: 8,
  },
  {
    id: "3",
    author: "박**",
    rating: 5,
    date: "2024-01-05",
    content: "두 번째 구매입니다. 역시 만족스러워요.",
    helpful: 15,
  },
];

export function ProductReviews({
  reviews = mockReviews,
  averageRating = 4.5,
  totalReviews = reviews.length,
}: ProductReviewsProps) {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          구매 후기
        </h2>
        <div className="flex items-center gap-4">
          <StarRating rating={averageRating} showRating interactive={false} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({totalReviews}개 후기)
          </span>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {reviews.map((review, index) => (
          <AccordionItem key={review.id} value={`review-${review.id}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-start gap-4 w-full text-left">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {review.author[0]}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {review.author}
                    </span>
                    <StarRating
                      rating={review.rating}
                      size="sm"
                      interactive={false}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {review.date}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-14 pt-2">
                <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line">
                  {review.content}
                </p>
                {review.helpful !== undefined && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      도움됨 ({review.helpful})
                    </button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

