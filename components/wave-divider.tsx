/**
 * @file wave-divider.tsx
 * @description Wave Divider 컴포넌트
 *
 * 섹션 사이에 배치되는 Wave 형태의 구분선입니다.
 * 블루 톤 그라디언트를 적용하여 시각적 효과를 제공합니다.
 */

export function WaveDivider() {
  return (
    <div className="relative w-full h-16 overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0,60 C300,100 600,20 900,60 C1050,80 1125,70 1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradient)"
          className="dark:hidden"
        />
        <path
          d="M0,60 C300,100 600,20 900,60 C1050,80 1125,70 1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradientDark)"
          className="hidden dark:block"
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#F3F4F6" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="waveGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

