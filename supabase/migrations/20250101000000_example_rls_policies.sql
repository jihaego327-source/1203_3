/**
 * RLS 정책 예시 파일
 * 
 * 이 파일은 Clerk + Supabase 통합 시 사용할 수 있는 RLS 정책 예시를 제공합니다.
 * 실제 프로젝트에 맞게 수정하여 사용하세요.
 * 
 * 참고: 개발 환경에서는 RLS를 비활성화할 수 있지만,
 * 프로덕션 환경에서는 반드시 RLS를 활성화하고 적절한 정책을 설정해야 합니다.
 */

-- ============================================
-- 예시 1: 사용자 프로필 테이블 (users)
-- ============================================

-- 테이블 생성 (이미 존재하는 경우 건너뛰기)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can delete their own data" ON users;

-- SELECT 정책: 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'sub' = clerk_id);

-- INSERT 정책: 사용자는 자신의 데이터만 생성 가능
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'sub' = clerk_id);

-- UPDATE 정책: 사용자는 자신의 데이터만 수정 가능
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'sub' = clerk_id)
  WITH CHECK (auth.jwt()->>'sub' = clerk_id);

-- DELETE 정책: 사용자는 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete their own data"
  ON users FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'sub' = clerk_id);

-- ============================================
-- 예시 2: 작업 테이블 (tasks)
-- ============================================

-- 테이블 생성
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(clerk_id) ON DELETE CASCADE
);

-- RLS 활성화
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

-- SELECT 정책: 사용자는 자신의 작업만 조회 가능
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id);

-- INSERT 정책: 사용자는 자신의 작업만 생성 가능
-- user_id는 자동으로 현재 사용자의 Clerk ID로 설정됨
CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'sub' = user_id);

-- UPDATE 정책: 사용자는 자신의 작업만 수정 가능
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id)
  WITH CHECK (auth.jwt()->>'sub' = user_id);

-- DELETE 정책: 사용자는 자신의 작업만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id);

-- ============================================
-- 예시 3: 공유 가능한 문서 테이블 (documents)
-- ============================================

-- 테이블 생성
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (owner_id) REFERENCES users(clerk_id) ON DELETE CASCADE
);

-- RLS 활성화
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can view public documents" ON documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

-- SELECT 정책 1: 사용자는 자신의 문서를 조회 가능
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'sub' = owner_id);

-- SELECT 정책 2: 모든 사용자는 공개 문서를 조회 가능
CREATE POLICY "Users can view public documents"
  ON documents FOR SELECT
  TO authenticated
  USING (is_public = true);

-- INSERT 정책: 사용자는 자신의 문서만 생성 가능
CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'sub' = owner_id);

-- UPDATE 정책: 사용자는 자신의 문서만 수정 가능
CREATE POLICY "Users can update their own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'sub' = owner_id)
  WITH CHECK (auth.jwt()->>'sub' = owner_id);

-- DELETE 정책: 사용자는 자신의 문서만 삭제 가능
CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'sub' = owner_id);

-- ============================================
-- 유용한 함수: 현재 사용자의 Clerk ID 가져오기
-- ============================================

-- 현재 사용자의 Clerk ID를 반환하는 함수
CREATE OR REPLACE FUNCTION get_current_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.jwt()->>'sub';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 사용 예시:
-- SELECT * FROM tasks WHERE user_id = get_current_clerk_user_id();

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- user_id로 빠른 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_is_public ON documents(is_public);

-- ============================================
-- 주의사항
-- ============================================

-- 1. 개발 환경에서 RLS를 비활성화하려면:
--    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
--    ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
--    ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- 2. 프로덕션 환경에서는 반드시 RLS를 활성화하고 적절한 정책을 설정하세요.

-- 3. Service Role 클라이언트는 모든 RLS를 우회하므로,
--    서버 사이드에서만 사용하고 클라이언트에 노출하지 마세요.

-- 4. RLS 정책 테스트:
--    SELECT auth.jwt()->>'sub' as current_user_id;
--    이 쿼리를 실행하여 현재 사용자의 Clerk ID를 확인할 수 있습니다.

