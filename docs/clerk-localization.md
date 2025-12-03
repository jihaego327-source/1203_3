# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [기본 설정](#기본-설정)
3. [커스텀 로컬라이제이션](#커스텀-로컬라이제이션)
4. [에러 메시지 커스터마이징](#에러-메시지-커스터마이징)
5. [참고 자료](#참고-자료)

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 다양한 언어를 지원합니다. 이 프로젝트는 한국어(`koKR`) 로컬라이제이션을 사용합니다.

**지원 언어**: Clerk는 50개 이상의 언어를 지원하며, 한국어는 `koKR`로 import합니다.

## 기본 설정

프로젝트에는 이미 한국어 로컬라이제이션이 설정되어 있습니다:

### 1. 패키지 설치

`@clerk/localizations` 패키지가 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@clerk/localizations": "^3.26.3"
  }
}
```

### 2. 로컬라이제이션 파일

`lib/clerk/localization.ts` 파일에서 한국어 로컬라이제이션을 관리합니다:

```tsx
import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

export const clerkLocalization: LocalizationResource = {
  ...koKR,
  // 커스텀 번역 추가 가능
};
```

### 3. ClerkProvider 설정

`app/layout.tsx`에서 로컬라이제이션을 적용합니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { clerkLocalization } from "@/lib/clerk/localization";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## 커스텀 로컬라이제이션

특정 텍스트를 브랜드에 맞게 변경하려면 `lib/clerk/localization.ts` 파일을 수정하세요:

```tsx
import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

export const clerkLocalization: LocalizationResource = {
  ...koKR,
  
  // 로그인 페이지 제목 변경
  signIn: {
    start: {
      title: "환영합니다",
      subtitle: "계정에 로그인하세요",
    },
  },
  
  // 회원가입 페이지 제목 변경
  signUp: {
    start: {
      title: "계정 만들기",
      subtitle: "새로운 계정을 생성하세요",
    },
  },
  
  // 버튼 텍스트 변경
  socialButtonsBlockButton: "{{provider|titleize}}로 계속하기",
};
```

### 사용 가능한 커스터마이징 옵션

Clerk 로컬라이제이션 객체는 다음 섹션들을 포함합니다:

- `signIn`: 로그인 관련 텍스트
- `signUp`: 회원가입 관련 텍스트
- `userButton`: 사용자 버튼 관련 텍스트
- `userProfile`: 사용자 프로필 관련 텍스트
- `organizationSwitcher`: 조직 전환 관련 텍스트
- `formButtonPrimary`: 주요 버튼 텍스트
- `formFieldLabel`: 폼 필드 레이블
- `formFieldInputPlaceholder`: 입력 필드 플레이스홀더
- `footerActionLink`: 푸터 링크 텍스트

전체 구조를 확인하려면 `@clerk/localizations` 패키지의 타입 정의를 참고하세요.

## 에러 메시지 커스터마이징

에러 메시지를 커스터마이징하려면 `unstable__errors` 객체를 사용합니다:

```tsx
import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

export const clerkLocalization: LocalizationResource = {
  ...koKR,
  
  // 에러 메시지 커스터마이징
  unstable__errors: {
    // 허용되지 않은 이메일 도메인 접근 시
    not_allowed_access:
      "접근 권한이 없습니다. 관리자에게 문의하세요.",
    
    // 잘못된 자격 증명
    form_identifier_not_found:
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    
    // 이미 존재하는 이메일
    form_email_address_exists:
      "이 이메일은 이미 사용 중입니다.",
  },
};
```

### 주요 에러 키

- `not_allowed_access`: 허용되지 않은 접근
- `form_identifier_not_found`: 사용자를 찾을 수 없음
- `form_email_address_exists`: 이메일이 이미 존재함
- `form_password_pwned`: 비밀번호가 유출됨
- `form_password_length_too_short`: 비밀번호가 너무 짧음
- `form_password_not_strong_enough`: 비밀번호가 충분히 강력하지 않음

전체 에러 키 목록은 Clerk 공식 문서를 참고하세요.

## 사용 예시

### 예시 1: 기본 사용 (현재 설정)

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { clerkLocalization } from "@/lib/clerk/localization";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      {children}
    </ClerkProvider>
  );
}
```

### 예시 2: 커스텀 번역 추가

```tsx
// lib/clerk/localization.ts
import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

export const clerkLocalization: LocalizationResource = {
  ...koKR,
  signIn: {
    start: {
      title: "{{applicationName}}에 로그인",
      subtitle: "계정에 로그인하여 계속하세요",
    },
  },
};
```

### 예시 3: 브랜드에 맞는 에러 메시지

```tsx
// lib/clerk/localization.ts
import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

export const clerkLocalization: LocalizationResource = {
  ...koKR,
  unstable__errors: {
    not_allowed_access:
      "이 이메일 도메인은 허용되지 않습니다. " +
      "회사 이메일 도메인을 허용 목록에 추가하려면 관리자에게 문의하세요.",
  },
};
```

## 주의사항

### 실험적 기능

> ⚠️ **경고**: 로컬라이제이션 기능은 현재 실험적(experimental)입니다. 
> 문제가 발생하면 [Clerk 지원팀](https://clerk.com/contact/support)에 문의하세요.

### 제한사항

- 로컬라이제이션은 **Clerk 컴포넌트**의 텍스트만 변경합니다
- **Clerk Account Portal** (호스팅된 계정 포털)은 여전히 영어로 표시됩니다
- 일부 동적 텍스트는 변경되지 않을 수 있습니다

## 테스트

로컬라이제이션이 제대로 작동하는지 확인하려면:

1. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. 로그인/회원가입 페이지 확인:
   - `/sign-in`: 로그인 페이지
   - `/sign-up`: 회원가입 페이지

3. 모든 텍스트가 한국어로 표시되는지 확인

## 참고 자료

- [Clerk 로컬라이제이션 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)
- [@clerk/localizations 패키지](https://www.npmjs.com/package/@clerk/localizations)
- [지원 언어 목록](https://clerk.com/docs/guides/customizing-clerk/localization#languages)

## 문제 해결

### 문제 1: 한국어가 적용되지 않음

**해결 방법**:
1. `@clerk/localizations` 패키지가 설치되어 있는지 확인
2. `ClerkProvider`에 `localization` prop이 전달되었는지 확인
3. 브라우저 캐시를 지우고 새로고침

### 문제 2: 일부 텍스트가 여전히 영어로 표시됨

**원인**: Clerk Account Portal은 로컬라이제이션을 지원하지 않습니다.

**해결 방법**: 이는 정상적인 동작입니다. Account Portal은 항상 영어로 표시됩니다.

### 문제 3: 커스텀 번역이 적용되지 않음

**해결 방법**:
1. 타입이 올바른지 확인 (`LocalizationResource`)
2. 객체 구조가 올바른지 확인
3. 개발 서버를 재시작

