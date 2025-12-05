# 배포 가이드

이 문서는 Next.js 애플리케이션을 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비사항

1. **GitHub 계정**: 코드를 GitHub 저장소에 푸시해야 합니다.
2. **Vercel 계정**: [Vercel](https://vercel.com)에 가입하세요.
3. **Clerk 계정**: [Clerk](https://clerk.com)에 가입하고 애플리케이션을 생성하세요.
4. **Supabase 계정**: [Supabase](https://supabase.com)에 가입하고 프로젝트를 생성하세요.

## 1. Vercel 프로젝트 생성

### 1.1 GitHub 저장소 연결

1. Vercel 대시보드에 로그인합니다.
2. **Add New...** → **Project**를 클릭합니다.
3. GitHub 저장소를 선택하거나 새로 연결합니다.
4. 저장소를 선택하고 **Import**를 클릭합니다.

### 1.2 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다. 다음 설정을 확인하세요:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (기본값)
- **Build Command**: `pnpm build` (자동 감지됨)
- **Output Directory**: `.next` (자동 감지됨)
- **Install Command**: `pnpm install` (자동 감지됨)

## 2. 환경변수 설정

Vercel 프로젝트 설정에서 **Environment Variables** 섹션으로 이동하여 다음 환경변수를 추가하세요:

### Clerk 환경변수

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

**Clerk 키 발급 방법:**
1. [Clerk 대시보드](https://dashboard.clerk.com)에 로그인
2. 애플리케이션 선택
3. **API Keys** 섹션에서 키 복사
4. 프로덕션 환경에서는 **Production** 키를 사용하세요

### Supabase 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

**Supabase 키 발급 방법:**
1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 섹션에서 키 복사
4. `SUPABASE_SERVICE_ROLE_KEY`는 **Settings** → **API** → **service_role** 키를 사용하세요 (주의: 이 키는 서버 사이드에서만 사용)

### 환경별 설정

각 환경변수는 다음 환경에 대해 설정할 수 있습니다:
- **Production**: 프로덕션 배포에 사용
- **Preview**: 프리뷰 배포에 사용
- **Development**: 로컬 개발에 사용 (선택사항)

## 3. Clerk 설정

### 3.1 Allowed Origins 설정

Clerk 대시보드에서 배포된 도메인을 허용해야 합니다:

1. Clerk 대시보드 → **Settings** → **Domains**
2. **Allowed Origins**에 Vercel 배포 URL 추가:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (커스텀 도메인 사용 시)

### 3.2 Redirect URLs 설정

1. Clerk 대시보드 → **Settings** → **Paths**
2. **Redirect URLs**에 다음 URL 추가:
   - `https://your-project.vercel.app/*`
   - `https://your-custom-domain.com/*`

## 4. Supabase 설정

### 4.1 RLS 정책 확인

프로덕션 환경에서는 반드시 Row Level Security (RLS)를 활성화하고 적절한 정책을 설정해야 합니다.

개발 환경에서 RLS를 비활성화했다면, 프로덕션 배포 전에 다음을 확인하세요:

1. Supabase 대시보드 → **Authentication** → **Policies**
2. 각 테이블에 대한 RLS 정책이 올바르게 설정되어 있는지 확인
3. `auth.jwt()->>'sub'`를 사용하여 Clerk user ID를 확인하는 정책이 있는지 확인

### 4.2 데이터베이스 마이그레이션

프로덕션 데이터베이스에 마이그레이션을 적용하세요:

```bash
# Supabase CLI를 사용하여 마이그레이션 적용
supabase db push
```

또는 Supabase 대시보드에서 직접 SQL을 실행할 수 있습니다.

## 5. 배포 실행

환경변수를 모두 설정한 후:

1. Vercel 대시보드에서 **Deploy** 버튼을 클릭합니다.
2. 배포가 완료되면 **Visit** 버튼을 클릭하여 배포된 사이트를 확인합니다.

## 6. 배포 후 확인사항

### 6.1 기본 기능 확인

- [ ] 홈페이지가 정상적으로 로드되는가?
- [ ] 로그인/회원가입이 작동하는가?
- [ ] 상품 목록이 표시되는가?
- [ ] 장바구니 기능이 작동하는가?
- [ ] 주문 기능이 작동하는가?

### 6.2 인증 확인

- [ ] Clerk 로그인이 정상적으로 작동하는가?
- [ ] 로그인 후 사용자 정보가 표시되는가?
- [ ] 보호된 페이지 접근이 제한되는가?

### 6.3 데이터베이스 확인

- [ ] Supabase 연결이 정상인가?
- [ ] 데이터 조회/저장이 작동하는가?
- [ ] RLS 정책이 올바르게 적용되는가?

### 6.4 에러 확인

- [ ] 브라우저 콘솔에 에러가 없는가?
- [ ] Vercel 로그에 에러가 없는가?
- [ ] 네트워크 요청이 실패하지 않는가?

## 7. 커스텀 도메인 설정 (선택사항)

### 7.1 Vercel에서 도메인 추가

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 도메인을 입력하고 **Add** 클릭
3. DNS 설정 안내를 따릅니다

### 7.2 Clerk 도메인 업데이트

커스텀 도메인을 사용하는 경우 Clerk 설정도 업데이트해야 합니다:

1. Clerk 대시보드 → **Settings** → **Domains**
2. 새로운 도메인을 **Allowed Origins**에 추가
3. **Redirect URLs**에도 추가

## 8. 트러블슈팅

### 배포 실패

- 환경변수가 올바르게 설정되었는지 확인
- 빌드 로그를 확인하여 에러 메시지 확인
- 로컬에서 `pnpm build`가 성공하는지 확인

### 인증 오류

- Clerk 키가 올바른지 확인 (프로덕션 키 사용)
- Allowed Origins에 배포 URL이 추가되었는지 확인
- Redirect URLs이 올바르게 설정되었는지 확인

### 데이터베이스 오류

- Supabase URL과 키가 올바른지 확인
- RLS 정책이 올바르게 설정되었는지 확인
- 마이그레이션이 적용되었는지 확인

## 9. 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)

