/**
 * @file format.ts
 * @description 포맷팅 유틸리티 함수
 */

/**
 * 숫자를 한국 원화 형식으로 포맷팅합니다
 * @param price - 가격 (숫자)
 * @returns 포맷팅된 가격 문자열
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

