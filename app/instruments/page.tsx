import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

/**
 * Supabase 공식 문서 예시를 기반으로 한 Instruments 페이지
 * 
 * 이 페이지는 Supabase 공식 문서의 모범 사례를 따릅니다:
 * - Server Component에서 데이터 조회
 * - Suspense를 사용한 로딩 상태 처리
 * - Clerk 인증 확인
 * 
 * 참고: Supabase Dashboard의 SQL Editor에서 다음 쿼리를 실행하여
 * instruments 테이블을 생성하세요:
 * 
 * ```sql
 * CREATE TABLE instruments (
 *   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 *   name TEXT NOT NULL
 * );
 * 
 * INSERT INTO instruments (name) VALUES
 *   ('violin'),
 *   ('viola'),
 *   ('cello');
 * 
 * ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "public can read instruments"
 * ON public.instruments
 * FOR SELECT
 * TO anon
 * USING (true);
 * ```
 */
async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select();

  if (error) {
    console.error("Supabase error:", error);
    return (
      <div className="p-4 text-red-500">
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="p-4">
        <p>악기 데이터가 없습니다.</p>
        <p className="text-sm mt-2 text-gray-500">
          Supabase Dashboard의 SQL Editor에서 instruments 테이블을 생성하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">악기 목록</h2>
      <ul className="space-y-2">
        {instruments.map((instrument: any) => (
          <li
            key={instrument.id}
            className="p-3 bg-gray-100 rounded-lg dark:bg-gray-800"
          >
            {instrument.name}
          </li>
        ))}
      </ul>
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm">
          <strong>참고:</strong> 이 데이터는 Supabase에서 직접 조회되었습니다.
          Supabase 공식 문서의 모범 사례를 따르고 있습니다.
        </p>
      </div>
    </div>
  );
}

export default function Instruments() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Supabase 연결 테스트</h1>
      
      <SignedIn>
        <Suspense fallback={<div className="p-4">로딩 중...</div>}>
          <InstrumentsData />
        </Suspense>
      </SignedIn>
      
      <SignedOut>
        <div className="p-4">
          <p>로그인이 필요합니다.</p>
        </div>
      </SignedOut>
    </div>
  );
}

