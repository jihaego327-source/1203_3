# Supabase + Next.js 통합 가이드

이 문서는 Supabase 공식 문서의 모범 사례를 기반으로 Next.js 프로젝트에 Supabase를 통합하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [패키지 설치](#패키지-설치)
3. [환경 변수 설정](#환경-변수-설정)
4. [Supabase 클라이언트 설정](#supabase-클라이언트-설정)
5. [사용 예시](#사용-예시)
6. [추가 리소스](#추가-리소스)

## 개요

이 프로젝트는 Supabase 공식 문서의 모범 사례를 따릅니다:

- ✅ **@supabase/ssr 패키지 사용**: Cookie-based 세션 관리
- ✅ **Server Component**: `createServerClient` 사용
- ✅ **Client Component**: `createBrowserClient` 사용
- ✅ **Clerk 통합**: Clerk 토큰을 Supabase에 전달

## 패키지 설치

필요한 패키지가 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.8",
    "@supabase/ssr": "^0.8.0"
  }
}
```

## 환경 변수 설정

`.env` 파일에 다음 변수들이 설정되어 있어야 합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Supabase 클라이언트 설정

프로젝트에는 환경별로 분리된 Supabase 클라이언트가 있습니다:

### 1. Server Component용 (`lib/supabase/server.ts`)

Supabase 공식 문서의 모범 사례를 따릅니다:

```tsx
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('instruments').select();
  return <div>{/* ... */}</div>;
}
```

**특징**:
- `@supabase/ssr`의 `createServerClient` 사용
- Cookie-based 세션 관리
- Clerk 토큰 자동 전달

### 2. Client Component용 (`lib/supabase/clerk-client.ts`)

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  // ...
}
```

**특징**:
- `@supabase/ssr`의 `createBrowserClient` 사용
- 자동 cookie 관리
- Clerk 토큰 자동 전달

### 3. 공개 데이터용 (`lib/supabase/client.ts`)

인증이 필요 없는 공개 데이터 조회용:

```tsx
'use client';

import { supabase } from '@/lib/supabase/client';

export default function PublicData() {
  useEffect(() => {
    supabase.from('public_posts').select('*').then(({ data }) => {
      // ...
    });
  }, []);
}
```

## 사용 예시

### 예시 1: Server Component에서 데이터 조회

Supabase 공식 문서의 예시를 기반으로 합니다:

```tsx
// app/instruments/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();
  
  return (
    <pre>{JSON.stringify(instruments, null, 2)}</pre>
  );
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading instruments...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}
```

### 예시 2: Client Component에서 데이터 조회

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';

export default function InstrumentsList() {
  const supabase = useClerkSupabaseClient();
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    async function fetchInstruments() {
      const { data } = await supabase.from('instruments').select();
      setInstruments(data || []);
    }
    fetchInstruments();
  }, [supabase]);

  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.id}>{instrument.name}</li>
      ))}
    </ul>
  );
}
```

### 예시 3: Server Action에서 데이터 생성

```tsx
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createInstrument(name: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('instruments')
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create instrument: ${error.message}`);
  }

  revalidatePath('/instruments');
  return data;
}
```

## 테스트 페이지

프로젝트에는 Supabase 연결을 테스트할 수 있는 페이지가 포함되어 있습니다:

- `/instruments`: Supabase 공식 문서 예시를 기반으로 한 테스트 페이지

이 페이지를 사용하려면:

1. Supabase Dashboard → SQL Editor로 이동
2. `supabase/migrations/20250101000001_create_instruments_table.sql` 파일의 내용 실행
3. 브라우저에서 `/instruments` 페이지 접속

## Supabase 공식 문서와의 차이점

이 프로젝트는 Supabase 공식 문서의 모범 사례를 따르지만, Clerk를 사용하므로 다음 차이점이 있습니다:

### 1. 인증 방식

**Supabase 공식 문서**:
- Supabase Auth 사용
- `supabase.auth.getUser()` 사용

**이 프로젝트**:
- Clerk 인증 사용
- `accessToken()` 옵션으로 Clerk 토큰 전달
- RLS 정책에서 `auth.jwt()->>'sub'`로 Clerk user ID 확인

### 2. 클라이언트 생성

**Supabase 공식 문서**:
```tsx
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

**이 프로젝트**:
```tsx
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient(); // 동일하지만 Clerk 토큰 자동 전달
```

### 3. RLS 정책

**Supabase 공식 문서**:
```sql
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);
```

**이 프로젝트 (Clerk 사용 시)**:
```sql
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = clerk_id);
```

## 추가 리소스

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase SSR 패키지 문서](https://supabase.com/docs/reference/javascript/ssr)
- [Clerk Supabase 통합 가이드](./clerk-supabase-integration.md)

