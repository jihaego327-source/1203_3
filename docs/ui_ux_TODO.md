## 🎨 1. 기본 디자인 톤 잡기
- [x] 배경: **#FFFFFF (화이트)**  
- [x] 텍스트 컬러: **#111827 (짙은 그레이)**  
- [x] 포인트 컬러: **#2563EB (블루)**  
- [x] 폰트: `"Inter", sans-serif`  
- [x] Tailwind 설정에 `primary` 색상 추가  

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: "#2563eb",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
},
🧱 2. 페이지 기본 구조
Header

- [x] 왼쪽: 텍스트 로고 "SaaS Template"

- [x] 오른쪽: 로그인 버튼

- [x] 구분선 추가 → border-b border-gray-100

Hero 섹션

- [x] 중앙 정렬된 타이틀 (2줄 구성)

- [x] 서브텍스트: text-gray-500

- [x] CTA 버튼 2개

- [x] "시작하기" (파란 배경)

- [x] "GitHub 보기" (테두리형 버튼)

- [x] 여백 넉넉히 (py-20)

상품 섹션

- [x] 섹션 제목: 인기 상품

- [x] 3열 반응형 Grid (grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)

- [x] 카드 구성

- [x] 썸네일 영역 (정사각형 placeholder)

- [x] 상품명

- [x] 가격 (text-blue-600)

💡 3. UX 디테일 개선

- [x] 카드 Hover 시 transform: translateY(-2px)

- [x] 버튼 Hover 시 색상 변화 (bg-blue-700)

- [x] 부드러운 스크롤 (scrollIntoView({behavior:"smooth"}))

- [x] 모바일에서 텍스트 크기 축소

- [x] Hero 버튼 간격 gap-4

🧭 4. 반응형 구성

- [x] 모바일: 카드 1열

- [x] 태블릿: 카드 2열

- [x] 데스크탑: 카드 3~4열

- [x] Header 버튼 크기 조정 (px-3 py-1.5)

🧰 5. 구현 순서 (Cursor 실행 플로우)

- [x] Tailwind 테마 설정 수정

- [x] Header.tsx 생성 및 배치 (Navbar.tsx로 구현됨)

- [x] Hero.tsx 구성 (app/page.tsx에 인라인 구현)

- [x] ProductGrid.tsx 컴포넌트 생성

- [x] app/page.tsx에서 조합

- [x] Hover & Transition 세부 조정

- [x] 다크모드 대비 컬러 테스트

✅ 선택 기능 (옵션)

- [x] Supabase 로그인 버튼 추가 (Clerk 통합으로 완료)

- [x] Footer에 카피라이트 문구 추가

- [x] Hero 배경에 미세한 그라디언트 효과

- [x] 제품 데이터 Supabase에서 실시간 Fetch로 교체




UI/UX 확장
  🎨 1.Hero 섹션 (첫 화면 시각 강조)

[x] 1. 배경은 #FFFFFF 유지하되, Hero 섹션에淡한 블루 그라디언트 오버레이 추가 (예: from-[#E0F2FF] to-[#FFFFFF])
[x] 2. 텍스트 컬러는 #111827 유지, 섹션 제목에는 drop-shadow-sm 적용
[x] 3. CTA 버튼("시작하기")에 Glow 효과 (box-shadow: 0 0 8px #2563eb40) 추가
[x] 4. Hero 섹션 문장 사이 간격(line-height) 넉넉히 조정
[x] 5. Hero 하단에 "scroll down" 아이콘(SVG 또는 ⬇️) 추가
[x] 6. Hero 섹션 하단에 "신규 상품 보기" 버튼 추가 — 페이지 흐름 가이드

🧱 2.Product 카드 인터랙션

[x] 7. 카드 hover 시 scale(1.03) + shadow-lg transition 추가
[x] 8. 카드 이미지 hover 시 scale(1.05) + cursor-pointer 적용
[x] 9. 상품명 hover 시 텍스트 컬러 #2563EB로 변경
[x] 10. 카드 배경에 gradient border 효과 추가 (1px solid transparent + bg-gradient clip-border)
[x] 11. 상품 카드 상단에 카테고리 태그 추가 (예: NEW, BEST, SALE)
[x] 12. 모바일에서는 카드가 좌우 스크롤 가능한 scroll-snap-x 구조로 변경

🧭 3.Header / Footer / Layout

[x] 13. Header를 스크롤 시 고정, bg-white/70 + backdrop-blur-md + shadow-sm 적용
[x] 14. Hero 섹션과 Product 섹션 사이에 Wave Divider(SVG) 추가
[x] 15. Footer에 블루 톤 라인 아이콘 (GitHub, Twitter 등) 배치
[x] 16. Footer 전체 여백을 넉넉히 주고 브랜드명 또는 카피라이트 추가

✨ 4.인터랙션 및 전역 스타일

[x] 17. 버튼 hover 시 translateY(-1px) 이동 효과
[x] 18. 애니메이션 easing: ease-out 또는 cubic-bezier(0.4, 0, 0.2, 1)
[x] 19. 주요 인터랙션에 transition-all duration-300 일괄 적용
[x] 20. 전반적인 색상 대비는 WCAG 2.1 AA 기준 이상 유지
[x] 21. 다크모드에서는 배경 #0f172a, 텍스트 #f8fafc, 블루 #3b82f6로 변경


최종 uiux
🏠 메인 랜딩 (Hero / 프로모션)

[x] 1. 상단에 Hero 섹션 대신 메인 프로모션 배너 배치 (슬라이드형 Carousel)
[x] 2. 주요 혜택 문구(무료배송, 신상품 업데이트 등) 배너 상단에 작은 Bar로 표시
[x] 3. CTA 버튼 1개는 "지금 쇼핑하기", 다른 하나는 "신상품 보기"로 구분
[x] 4. Hero 배경은 실제 상품 이미지(또는 패턴) 위에 반투명 화이트 오버레이
[x] 5. Hero 아래 바로 "인기 카테고리 섹션"을 배치 (아이콘 또는 미니 카드 4~6개)
[x] 6. 스크롤 시 Hero가 축소되고 Header가 투명 → 흰색으로 전환되는 애니메이션

🛍️ 상품 리스트 (Shop Section)

[x] 7. 카테고리 필터 바 상단 고정 (All / Fashion / Beauty / Tech / Books 등)
[x] 8. 필터 선택 시 부드러운 fade-in + scale 애니메이션으로 상품 갱신
[x] 9. 상품 카드 hover 시 '🛒 담기' 버튼이 아래에서 슬라이드 업
[x] 10. 상품 카드에 할인율(%) 표시 뱃지 추가
[x] 11. 가격 표시: 기존가(회색, 취소선) + 할인가(블루, 굵게)
[x] 12. 반응형 구조에서 카드 수 자동 조정 (1–2–4 컬럼)
[x] 13. Intersection Observer로 스크롤 시 상품이 부드럽게 나타나는 효과 추가

