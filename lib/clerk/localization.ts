import { koKR } from "@clerk/localizations";

/**
 * Clerk 한국어 로컬라이제이션 설정
 * 
 * Clerk 공식 문서의 모범 사례를 따릅니다:
 * https://clerk.com/docs/guides/customizing-clerk/localization
 * 
 * 기본 한국어 번역을 사용하며, 필요시 커스텀 번역을 추가할 수 있습니다.
 * 
 * @example
 * ```tsx
 * import { clerkLocalization } from '@/lib/clerk/localization';
 * 
 * <ClerkProvider localization={clerkLocalization}>
 *   {children}
 * </ClerkProvider>
 * ```
 */
export const clerkLocalization = {
  ...koKR,
  // 필요시 커스텀 번역 추가
  // 예시: 특정 텍스트를 브랜드에 맞게 변경
  // signIn: {
  //   start: {
  //     title: "환영합니다",
  //   },
  // },
  
  // 에러 메시지 커스터마이징 (선택사항)
  // unstable__errors: {
  //   not_allowed_access:
  //     "접근 권한이 없습니다. 관리자에게 문의하세요.",
  // },
} as const;

