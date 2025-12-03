# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase를 통합하는 방법을 설명합니다. 2025년 4월부터 권장되는 **네이티브 통합 방식**을 사용합니다.

## 📋 목차

1. [개요](#개요)
2. [Clerk Supabase 통합 설정](#clerk-supabase-통합-설정)
3. [코드에서 사용하기](#코드에서-사용하기)
4. [RLS 정책 설정](#rls-정책-설정)
5. [문제 해결](#문제-해결)

## 개요

### 왜 네이티브 통합을 사용하나요?

2025년 4월부터 Clerk는 Supabase와의 네이티브 통합을 권장합니다. 이전의 JWT 템플릿 방식과 비교하여 다음과 같은 장점이 있습니다:

- ✅ **JWT 템플릿 불필요**: Clerk 대시보드에서 JWT 템플릿을 설정할 필요가 없습니다
- ✅ **Supabase JWT Secret 불필요**: Clerk에 Supabase의 JWT Secret을 공유할 필요가 없습니다
- ✅ **자동 토큰 갱신**: 각 요청마다 새로운 토큰을 가져올 필요가 없습니다
- ✅ **더 안전한 인증**: Supabase가 Clerk의 세션 토큰을 직접 검증합니다

### 작동 원리

1. 사용자가 Clerk를 통해 로그인합니다
2. Clerk가 세션 토큰을 발급합니다
3. Supabase 클라이언트가 `accessToken()` 함수를 통해 Clerk 세션 토큰을 가져옵니다
4. Supabase가 Clerk를 third-party auth provider로 설정되어 있으면, 토큰을 검증합니다
5. RLS 정책에서 `auth.jwt()->>'sub'`를 사용하여 Clerk user ID를 확인합니다

## Clerk Supabase 통합 설정

### 1단계: Clerk Dashboard에서 Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인합니다
2. 프로젝트 선택 후 **"Integrations"** 메뉴로 이동
3. **"Supabase"** 통합을 찾아 **"Activate Supabase integration"** 클릭
4. **"Clerk domain"** 값을 복사합니다 (예: `your-app-12.clerk.accounts.dev`)

### 2단계: Supabase에서 Clerk를 Third-Party Auth Provider로 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인합니다
2. 프로젝트 선택 후 **Settings** → **Authentication** → **Providers**로 이동
3. 페이지 하단의 **"Third-Party Auth"** 섹션을 찾습니다
4. **"Add Provider"** 또는 **"Enable Custom Access Token"** 클릭
5. 다음 정보를 입력합니다:

   - **Provider Name**: `Clerk` (또는 원하는 이름)
   - **JWT Issuer (Issuer URL)**:
     ```
     https://your-app-12.clerk.accounts.dev
     ```
     (1단계에서 복사한 Clerk domain을 사용)

   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (동일한 domain 사용)

6. **"Save"** 또는 **"Add Provider"** 클릭

### 3단계: 환경 변수 확인

`.env` 파일에 다음 변수들이 설정되어 있는지 확인하세요:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # 서버 사이드 전용
```

## 코드에서 사용하기

### Client Component에서 사용

Client Component에서는 `useClerkSupabaseClient()` 훅을 사용합니다:

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) {
        console.error('Error:', error);
        return;
      }
      
      setData(data || []);
    }

    fetchData();
  }, [supabase]);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Server Component에서 사용

Server Component에서는 `createClerkSupabaseClient()` 함수를 사용합니다:

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) {
    throw error;
  }

  return (
    <div>
      {data?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

Server Action에서도 동일하게 `createClerkSupabaseClient()`를 사용합니다:

```tsx
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';

export async function createTask(name: string) {
  const supabase = createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({ name });

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return data;
}
```

### 관리자 권한이 필요한 경우

RLS를 우회해야 하는 경우 (예: 사용자 동기화) `getServiceRoleClient()`를 사용합니다:

```tsx
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function syncUser(clerkId: string, name: string) {
  const supabase = getServiceRoleClient();
  
  const { data, error } = await supabase
    .from('users')
    .upsert({ clerk_id: clerkId, name }, { onConflict: 'clerk_id' });

  if (error) {
    throw error;
  }

  return data;
}
```

> ⚠️ **주의**: Service Role 클라이언트는 모든 RLS를 우회하므로 서버 사이드에서만 사용하고, 절대 클라이언트에 노출하지 마세요!

## RLS 정책 설정

Clerk와 Supabase를 통합할 때, RLS 정책에서 Clerk user ID를 확인하려면 `auth.jwt()->>'sub'`를 사용합니다.

### 기본 RLS 정책 예시

#### 1. 사용자 테이블 (users)

```sql
-- users 테이블 생성
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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
```

#### 2. 작업 테이블 (tasks) 예시

```sql
-- tasks 테이블 생성
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(clerk_id)
);

-- RLS 활성화
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 작업만 조회 가능
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id);

-- INSERT 정책: 사용자는 자신의 작업만 생성 가능
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
```

### user_id 자동 설정

테이블에 `user_id` 컬럼이 있고, 기본값으로 현재 사용자의 Clerk ID를 설정하려면:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

이렇게 하면 INSERT 시 `user_id`를 명시하지 않아도 자동으로 현재 사용자의 Clerk ID가 설정됩니다.

## 문제 해결

### 문제 1: "Invalid JWT" 오류

**증상**: Supabase에서 "Invalid JWT" 오류가 발생합니다.

**해결 방법**:
1. Supabase Dashboard에서 Clerk third-party auth provider 설정이 올바른지 확인
2. Clerk domain이 정확한지 확인 (https:// 포함 여부 확인)
3. JWKS URI가 올바른지 확인 (`.well-known/jwks.json` 포함)
4. 환경 변수가 올바르게 설정되었는지 확인

### 문제 2: RLS 정책이 작동하지 않음

**증상**: 데이터를 조회하거나 수정할 수 없습니다.

**해결 방법**:
1. RLS가 활성화되어 있는지 확인:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```
2. RLS 정책이 올바르게 생성되었는지 확인:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'your_table';
   ```
3. `auth.jwt()->>'sub'`가 올바른 값을 반환하는지 확인:
   ```sql
   SELECT auth.jwt()->>'sub' as clerk_user_id;
   ```

### 문제 3: 클라이언트에서 토큰을 가져올 수 없음

**증상**: Client Component에서 `useClerkSupabaseClient()`를 사용할 때 오류가 발생합니다.

**해결 방법**:
1. 컴포넌트가 `'use client'` 지시어를 포함하고 있는지 확인
2. `useAuth()` 훅이 올바르게 작동하는지 확인
3. 사용자가 로그인한 상태인지 확인 (`SignedIn` 컴포넌트로 감싸기)

### 문제 4: Service Role 클라이언트가 작동하지 않음

**증상**: Service Role 클라이언트를 사용해도 권한 오류가 발생합니다.

**해결 방법**:
1. `SUPABASE_SERVICE_ROLE_KEY` 환경 변수가 올바르게 설정되었는지 확인
2. Service Role 키가 `service_role` 키인지 확인 (anon 키가 아님)
3. 서버 사이드에서만 사용하고 있는지 확인 (클라이언트에 노출되지 않았는지)

## 추가 리소스

- [Clerk 공식 Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 문서](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

