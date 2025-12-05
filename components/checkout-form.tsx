/**
 * @file checkout-form.tsx
 * @description 주문 폼 컴포넌트
 *
 * 배송지 정보와 주문 메모를 입력받는 폼입니다.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/lib/actions/orders";
import type { ShippingAddress } from "@/lib/types/order";

// Zod 스키마 정의
const checkoutSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .regex(/^[0-9-]+$/, "올바른 연락처 형식이 아닙니다."),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요.")
    .regex(/^[0-9]{5}$/, "올바른 우편번호 형식이 아닙니다."),
  address: z.string().min(1, "주소를 입력해주세요."),
  detailAddress: z.string().optional(),
  orderNote: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const shippingAddress: ShippingAddress = {
        name: data.name,
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        detailAddress: data.detailAddress,
      };

      const orderId = await createOrder({
        clerkId: userId,
        shippingAddress,
        orderNote: data.orderNote,
      });

      if (onSuccess) {
        onSuccess(orderId);
      } else {
        // 기본 동작: 결제 페이지로 이동
        router.push(`/payment?orderId=${orderId}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "주문 처리 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 배송지 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          배송지 정보
        </h3>

        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name">
            받는 분 이름 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="홍길동"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* 연락처 */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            연락처 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="010-1234-5678"
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* 우편번호 */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            우편번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            {...register("postalCode")}
            placeholder="12345"
            maxLength={5}
            aria-invalid={errors.postalCode ? "true" : "false"}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* 주소 */}
        <div className="space-y-2">
          <Label htmlFor="address">
            주소 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="서울시 강남구 테헤란로 123"
            aria-invalid={errors.address ? "true" : "false"}
          />
          {errors.address && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* 상세 주소 */}
        <div className="space-y-2">
          <Label htmlFor="detailAddress">상세 주소</Label>
          <Input
            id="detailAddress"
            {...register("detailAddress")}
            placeholder="101동 101호 (선택사항)"
          />
        </div>
      </div>

      {/* 주문 메모 */}
      <div className="space-y-2">
        <Label htmlFor="orderNote">주문 메모</Label>
        <textarea
          id="orderNote"
          {...register("orderNote")}
          placeholder="배송 시 요청사항을 입력해주세요. (선택사항)"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        size="lg"
        className="w-full hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:border-blue-500 border-2 border-transparent bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "주문 처리 중..." : "주문하기"}
      </Button>
    </form>
  );
}

