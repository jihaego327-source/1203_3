/**
 * Supabase 공식 문서 예시: Instruments 테이블 생성
 * 
 * 이 마이그레이션은 Supabase 공식 문서의 예시를 기반으로 합니다.
 * https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * 
 * 실행 방법:
 * 1. Supabase Dashboard → SQL Editor로 이동
 * 2. 이 파일의 내용을 복사하여 실행
 * 또는
 * 1. Supabase CLI를 사용하여 마이그레이션 실행
 */

-- Instruments 테이블 생성
CREATE TABLE IF NOT EXISTS instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- 샘플 데이터 삽입
INSERT INTO instruments (name)
VALUES
  ('violin'),
  ('viola'),
  ('cello')
ON CONFLICT DO NOTHING;

-- Row Level Security 활성화
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (anon 사용자도 읽을 수 있음)
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);

-- 인증된 사용자도 읽을 수 있음
CREATE POLICY "authenticated can read instruments"
ON public.instruments
FOR SELECT
TO authenticated
USING (true);

-- 주의: 이 예시는 공개 읽기 정책을 사용합니다.
-- 프로덕션 환경에서는 적절한 RLS 정책을 설정하세요.

