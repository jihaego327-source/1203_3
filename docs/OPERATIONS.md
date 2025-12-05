# 운영 가이드

이 문서는 쇼핑몰 애플리케이션의 일상적인 운영 작업을 위한 가이드입니다.

## 목차

1. [모니터링 및 로그 확인](#모니터링-및-로그-확인)
2. [일상적인 운영 작업](#일상적인-운영-작업)
3. [문제 해결 가이드](#문제-해결-가이드)
4. [데이터베이스 관리](#데이터베이스-관리)
5. [상품 관리](#상품-관리)

## 모니터링 및 로그 확인

### Vercel 로그 확인

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Deployments** 탭에서 최근 배포 선택
4. **Functions** 탭에서 함수별 로그 확인
5. **Runtime Logs**에서 실시간 로그 확인

### Supabase 로그 확인

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Logs** 메뉴에서 다음 로그 확인:
   - **API Logs**: API 요청 및 응답 로그
   - **Postgres Logs**: 데이터베이스 쿼리 로그
   - **Auth Logs**: 인증 관련 로그
   - **Storage Logs**: 파일 업로드/다운로드 로그

### Clerk 로그 확인

1. [Clerk 대시보드](https://dashboard.clerk.com/)에 로그인
2. 애플리케이션 선택
3. **Activity** 메뉴에서 사용자 활동 확인
4. **Sessions**에서 활성 세션 확인
5. **Webhooks**에서 웹훅 이벤트 확인

## 일상적인 운영 작업

### 사용자 관리

#### 사용자 조회
- Supabase 대시보드 → **Table Editor** → `users` 테이블에서 확인
- Clerk 대시보드 → **Users**에서 상세 정보 확인

#### 사용자 삭제
1. Clerk 대시보드에서 사용자 삭제
2. Supabase에서 해당 사용자의 데이터 정리 (주문, 장바구니 등)

### 주문 관리

#### 주문 상태 확인
- Supabase 대시보드 → **Table Editor** → `orders` 테이블
- 주문 상태 필드 확인:
  - `pending`: 결제 대기
  - `confirmed`: 결제 완료
  - `shipped`: 배송 중
  - `delivered`: 배송 완료
  - `cancelled`: 취소됨

#### 주문 상태 변경
Supabase SQL Editor에서 직접 업데이트:

```sql
-- 주문 상태를 배송 중으로 변경
UPDATE orders
SET status = 'shipped', updated_at = now()
WHERE id = '주문ID';

-- 주문 상태를 배송 완료로 변경
UPDATE orders
SET status = 'delivered', updated_at = now()
WHERE id = '주문ID';
```

### 재고 관리

#### 재고 확인
- Supabase 대시보드 → **Table Editor** → `products` 테이블
- `stock_quantity` 필드 확인

#### 재고 수정
Supabase SQL Editor에서 직접 업데이트:

```sql
-- 재고 수량 업데이트
UPDATE products
SET stock_quantity = 100, updated_at = now()
WHERE id = '상품ID';
```

#### 상품 비활성화
```sql
-- 상품 판매 중지
UPDATE products
SET is_active = false, updated_at = now()
WHERE id = '상품ID';
```

## 문제 해결 가이드

### 일반적인 문제

#### 1. 사용자가 로그인할 수 없음

**확인 사항:**
- Clerk 대시보드에서 애플리케이션이 활성화되어 있는지 확인
- 환경변수가 올바르게 설정되었는지 확인
- Vercel 로그에서 에러 메시지 확인

**해결 방법:**
- Clerk 대시보드 → **Settings** → **Domains**에서 Allowed Origins 확인
- 환경변수 재설정 후 재배포

#### 2. 주문이 생성되지 않음

**확인 사항:**
- Supabase 로그에서 데이터베이스 에러 확인
- 장바구니에 상품이 있는지 확인
- 재고가 충분한지 확인

**해결 방법:**
- Supabase SQL Editor에서 직접 주문 생성 테스트
- 재고 확인 및 업데이트

#### 3. 결제가 완료되지 않음

**확인 사항:**
- Toss Payments 테스트 모드 설정 확인
- 결제 금액이 주문 금액과 일치하는지 확인
- Vercel 로그에서 결제 콜백 에러 확인

**해결 방법:**
- Toss Payments 대시보드에서 결제 로그 확인
- 결제 콜백 URL이 올바른지 확인

#### 4. 데이터베이스 연결 오류

**확인 사항:**
- Supabase 프로젝트가 활성화되어 있는지 확인
- 환경변수 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인

**해결 방법:**
- Supabase 대시보드에서 프로젝트 상태 확인
- 환경변수 재설정 후 재배포

### 에러 코드별 해결 방법

#### PGRST116: No rows returned
- 정상적인 경우일 수 있음 (데이터가 없는 경우)
- 쿼리 조건을 확인하여 데이터가 실제로 존재하는지 확인

#### PGRST301: JWT expired
- Clerk 토큰이 만료됨
- 사용자가 다시 로그인하도록 안내

#### 401 Unauthorized
- 인증 토큰이 없거나 유효하지 않음
- Clerk 세션 확인

## 데이터베이스 관리

### 백업

#### Supabase 백업
1. Supabase 대시보드 → **Settings** → **Database**
2. **Backups** 섹션에서 자동 백업 확인
3. 수동 백업이 필요한 경우 **Create backup** 클릭

### 데이터 정리

#### 오래된 주문 데이터 정리
```sql
-- 1년 이상 된 주문 삭제 (선택사항)
DELETE FROM order_items
WHERE order_id IN (
  SELECT id FROM orders
  WHERE created_at < NOW() - INTERVAL '1 year'
);

DELETE FROM orders
WHERE created_at < NOW() - INTERVAL '1 year';
```

#### 장바구니 데이터 정리
```sql
-- 30일 이상 된 장바구니 아이템 삭제
DELETE FROM cart_items
WHERE updated_at < NOW() - INTERVAL '30 days';
```

### 성능 최적화

#### 인덱스 확인
```sql
-- 인덱스 목록 확인
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

#### 느린 쿼리 확인
- Supabase 대시보드 → **Database** → **Query Performance**에서 확인
- 자주 사용되는 쿼리에 인덱스 추가 고려

## 상품 관리

### 상품 추가

Supabase 대시보드에서 직접 추가:

1. **Table Editor** → `products` 테이블
2. **Insert row** 클릭
3. 다음 정보 입력:
   - `name`: 상품명
   - `description`: 상품 설명 (선택사항)
   - `price`: 가격 (숫자)
   - `stock_quantity`: 재고 수량
   - `category`: 카테고리 (선택사항)
   - `is_active`: `true` (판매 중)
4. **Save** 클릭

### 상품 수정

1. **Table Editor** → `products` 테이블
2. 수정할 상품 행 클릭
3. 필드 수정
4. **Save** 클릭

### 상품 삭제

**주의**: 주문에 연결된 상품은 삭제하지 마세요.

```sql
-- 주문에 연결되지 않은 상품만 삭제
DELETE FROM products
WHERE id NOT IN (
  SELECT DISTINCT product_id FROM order_items
)
AND id = '상품ID';
```

### 대량 상품 업데이트

CSV 파일을 사용하여 대량 업데이트:

1. Supabase 대시보드 → **Table Editor** → `products`
2. **Import data** 클릭
3. CSV 파일 업로드
4. 컬럼 매핑 확인
5. **Import** 클릭

## 정기 점검 사항

### 주간 점검
- [ ] 주문 상태 확인 및 업데이트
- [ ] 재고 부족 상품 확인
- [ ] 에러 로그 확인
- [ ] 사용자 피드백 확인

### 월간 점검
- [ ] 데이터베이스 백업 확인
- [ ] 성능 지표 확인
- [ ] 보안 업데이트 확인
- [ ] 의존성 업데이트 확인

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Toss Payments 문서](https://docs.tosspayments.com/)

## 문의 및 지원

문제가 발생하거나 도움이 필요한 경우:
1. 로그를 확인하여 에러 메시지 파악
2. 관련 문서 확인
3. 필요시 개발팀에 문의

