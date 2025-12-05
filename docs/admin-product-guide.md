# 어드민 상품 등록 가이드

이 문서는 Supabase 대시보드의 Table Editor를 사용하여 상품을 수동으로 등록하는 방법을 안내합니다.

## 목차

1. [Supabase 대시보드 접근](#supabase-대시보드-접근)
2. [Table Editor 사용법](#table-editor-사용법)
3. [상품 추가 방법](#상품-추가-방법)
4. [필수 필드 설명](#필수-필드-설명)
5. [샘플 데이터 예시](#샘플-데이터-예시)

## Supabase 대시보드 접근

1. [Supabase 대시보드](https://app.supabase.com)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 사이드바에서 **Table Editor**를 클릭합니다.
4. `products` 테이블을 선택합니다.

## Table Editor 사용법

### 새 행 추가

1. `products` 테이블을 열면 기존 상품 목록이 표시됩니다.
2. 화면 상단의 **Insert** 버튼을 클릭합니다.
3. **Insert row**를 선택합니다.
4. 각 필드를 입력합니다.

### 기존 상품 수정

1. 수정하고자 하는 상품 행을 클릭합니다.
2. 필드를 더블클릭하거나 편집 모드로 전환합니다.
3. 값을 수정한 후 저장합니다.

### 상품 삭제

1. 삭제하고자 하는 상품 행을 선택합니다.
2. 행의 오른쪽 끝에 있는 메뉴(⋮)를 클릭합니다.
3. **Delete row**를 선택합니다.
4. 확인 메시지에서 삭제를 확인합니다.

## 상품 추가 방법

### 1단계: 필수 필드 입력

다음 필드는 반드시 입력해야 합니다:

- **name** (TEXT, NOT NULL): 상품명
- **price** (DECIMAL, NOT NULL): 가격 (예: 25000.00)
- **stock_quantity** (INTEGER, DEFAULT 0): 재고 수량

### 2단계: 선택 필드 입력 (권장)

다음 필드들은 선택사항이지만 입력을 권장합니다:

- **description** (TEXT): 상품 설명
- **category** (TEXT): 카테고리 (예: "electronics", "clothing", "books")
- **is_active** (BOOLEAN, DEFAULT true): 활성화 여부

### 3단계: 자동 생성 필드

다음 필드들은 자동으로 생성되므로 입력할 필요가 없습니다:

- **id** (UUID): 고유 식별자
- **created_at** (TIMESTAMP): 생성 시간
- **updated_at** (TIMESTAMP): 수정 시간 (자동 업데이트)

## 필수 필드 설명

### name (상품명)

- **타입**: TEXT
- **필수**: Yes
- **예시**: "무선 블루투스 이어폰"

### description (설명)

- **타입**: TEXT
- **필수**: No
- **예시**: "고음질 노이즈 캔슬링 기능, 30시간 재생"

### price (가격)

- **타입**: DECIMAL(10,2)
- **필수**: Yes
- **형식**: 숫자만 입력 (예: 25000.00)
- **예시**: 89000.00

### category (카테고리)

- **타입**: TEXT
- **필수**: No
- **권장 카테고리**:
  - `electronics` (전자제품)
  - `clothing` (의류)
  - `books` (도서)
  - `food` (식품)
  - `sports` (스포츠)
  - `beauty` (뷰티)
  - `home` (생활용품)

### stock_quantity (재고 수량)

- **타입**: INTEGER
- **필수**: Yes (기본값: 0)
- **예시**: 150

### is_active (활성화 여부)

- **타입**: BOOLEAN
- **필수**: No (기본값: true)
- **설명**: 
  - `true`: 상품이 목록에 표시됨
  - `false`: 상품이 목록에서 숨김 처리됨

## 샘플 데이터 예시

### 예시 1: 전자제품

```json
{
  "name": "무선 블루투스 이어폰",
  "description": "고음질 노이즈 캔슬링 기능, 30시간 재생",
  "price": 89000.00,
  "category": "electronics",
  "stock_quantity": 150,
  "is_active": true
}
```

### 예시 2: 의류

```json
{
  "name": "면 100% 기본 티셔츠",
  "description": "심플한 디자인, 5가지 컬러",
  "price": 25000.00,
  "category": "clothing",
  "stock_quantity": 300,
  "is_active": true
}
```

### 예시 3: 도서

```json
{
  "name": "클린 코드",
  "description": "소프트웨어 장인 정신의 바이블",
  "price": 33000.00,
  "category": "books",
  "stock_quantity": 50,
  "is_active": true
}
```

## 주의사항

### 가격 입력 시

- 소수점 두 자리까지 입력 가능 (예: 25000.00)
- 천 단위 구분 기호(쉼표)는 입력하지 마세요
- 숫자만 입력하세요

### 재고 수량

- 0 이상의 정수만 입력 가능
- 음수는 입력할 수 없습니다

### 카테고리

- 대소문자를 구분하지 않습니다 (권장: 소문자)
- 일관된 카테고리명을 사용하는 것이 좋습니다
- 카테고리별로 필터링 기능이 작동합니다

### 활성화 여부

- `is_active`가 `false`인 상품은 웹사이트에서 표시되지 않습니다
- 삭제하지 않고 임시로 숨기고 싶을 때 사용합니다

## 문제 해결

### 상품이 목록에 표시되지 않을 때

1. `is_active` 필드가 `true`로 설정되어 있는지 확인
2. `stock_quantity`가 0 이상인지 확인
3. 브라우저 캐시를 지우고 새로고침

### 가격이 올바르게 표시되지 않을 때

1. 가격 필드가 숫자 형식인지 확인 (예: 25000.00)
2. 소수점은 두 자리까지만 입력
3. 천 단위 구분 기호를 사용하지 않았는지 확인

### 카테고리 필터가 작동하지 않을 때

1. 카테고리 이름의 대소문자가 일치하는지 확인
2. `category` 필드가 비어있지 않은지 확인
3. 상품 목록 페이지를 새로고침

## 추가 리소스

- [Supabase Table Editor 문서](https://supabase.com/docs/guides/database/tables)
- [PostgreSQL 데이터 타입 문서](https://www.postgresql.org/docs/current/datatype.html)

