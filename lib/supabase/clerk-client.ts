"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * Supabase 공식 문서의 모범 사례를 따릅니다:
 * - @supabase/ssr의 createBrowserClient 사용
 * - 자동 cookie 관리
 * - Clerk 토큰을 Supabase가 자동 검증
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - useAuth().getToken()으로 현재 세션 토큰 사용
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        async accessToken() {
          // Clerk 토큰을 Supabase에 전달
          return (await getToken()) ?? null;
        },
      }
    );
  }, [getToken]);

  return supabase;
}
