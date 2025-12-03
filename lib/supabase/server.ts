import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * Supabase 공식 문서의 모범 사례를 따릅니다:
 * - @supabase/ssr의 createServerClient 사용
 * - Cookie-based 세션 관리
 * - Clerk 토큰을 Supabase가 자동 검증
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - auth().getToken()으로 현재 세션 토큰 사용
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Component는 read-only이므로 경고만 로그
          // 실제 세션 갱신은 middleware에서 처리됩니다
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Server Component에서는 쿠키 설정이 제한될 수 있습니다
            // 이는 정상적인 동작이며, middleware에서 처리됩니다
          }
        },
      },
      async accessToken() {
        // Clerk 토큰을 Supabase에 전달
        return (await auth()).getToken() ?? null;
      },
    }
  );
}

/**
 * @deprecated 이 함수는 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 `createClient()`를 사용하세요.
 */
export function createClerkSupabaseClient() {
  // 하위 호환성을 위해 동기 함수로 래핑
  // 하지만 실제로는 비동기 createClient()를 사용하는 것이 권장됩니다
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server Component는 read-only
        },
      },
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
}
