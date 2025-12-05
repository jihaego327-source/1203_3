/**
 * @file route.ts
 * @description 장바구니 개수 조회 API Route
 *
 * 클라이언트 컴포넌트에서 장바구니 아이템 개수를 조회하기 위한 API Route입니다.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCartTotal } from "@/lib/actions/cart";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ itemCount: 0 });
    }

    const total = await getCartTotal();

    return NextResponse.json({
      itemCount: total.itemCount,
    });
  } catch (error) {
    console.error("장바구니 개수 조회 오류:", error);
    return NextResponse.json(
      { error: "장바구니 개수를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

