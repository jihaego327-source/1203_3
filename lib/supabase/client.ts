import { createBrowserClient } from "@supabase/ssr";

/**
 * 공개 데이터용 Supabase 클라이언트 (Client Component용)
 *
 * 인증이 필요 없는 공개 데이터를 조회할 때 사용합니다.
 * Supabase 공식 문서의 모범 사례를 따릅니다.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { supabase } from '@/lib/supabase/client';
 *
 * export default function PublicData() {
 *   const [data, setData] = useState([]);
 *
 *   useEffect(() => {
 *     supabase.from('public_posts').select('*').then(({ data }) => {
 *       setData(data || []);
 *     });
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
