// ============================================================
// [Tailwind 설정 파일] 스타일 가이드의 디자인 토큰을 Tailwind 클래스로 1:1 맵핑
// 예: bg-neutral-900, text-blue-500, p-spacing-300, rounded-radius-16
//
// Vite 프로젝트에서는 'export default' 형식으로 내보내야 합니다.
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // [content] Tailwind가 사용된 클래스를 스캔할 파일 경로 목록
  // 이 목록에 없는 파일의 클래스는 최종 CSS에 포함되지 않음
  content: [
    "./index.html",         // 루트 HTML 파일
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 안의 모든 JS/TS/JSX/TSX 파일
  ],

  // darkMode: 'class' → <html class="dark"> 가 있을 때만 다크모드 적용
  darkMode: 'class',

  theme: {
    extend: {

      // === 1. 색상 팔레트 (Colors) ===
      colors: {
        'neutral-900': '#12131A', // 가장 어두운 배경 (다크모드 페이지 배경)
        'neutral-800': '#21222C', // 카드/헤더 배경 (다크모드)
        'neutral-700': '#2A2B37', // 보조 어두운 배경, 경계선
        'neutral-600': '#404254', // 보조 텍스트, 아이콘
        'neutral-200': '#E4E4EF', // 라이트모드 경계선
        'neutral-100': '#F2F2F7', // 라이트모드 보조 배경
        'neutral-0':   '#FFFFFF', // 순수 흰색
        'blue-400':    '#D3A0FA', // 밝은 보라 (글자 수 카드 배경)
        'blue-500':    '#C27CF8', // 메인 포인트 보라 (포커스, 프로그레스 바)
        'yellow-500':  '#FF9F00', // 노란색 (단어 수 카드 배경)
        'orange-500':  '#FE8159', // 주황색 (문장 수 카드 배경)
        'orange-800':  '#DA3701', // 진한 주황 (경고용)
      },

      // === 2. 타이포그래피 프리셋 (Typography) ===
      // [크기, { 줄간격, 자간, 굵기 }] 형태로 정의
      fontSize: {
        'preset-1':        ['64px', { lineHeight: '100%', letterSpacing: '-1px',   fontWeight: '700' }],
        'preset-1-mobile': ['40px', { lineHeight: '100%', letterSpacing: '-1px',   fontWeight: '700' }],
        'preset-2':        ['24px', { lineHeight: '130%', letterSpacing: '-1px',   fontWeight: '600' }],
        'preset-3':        ['20px', { lineHeight: '140%', letterSpacing: '-0.6px', fontWeight: '400' }],
        'preset-4':        ['16px', { lineHeight: '130%', letterSpacing: '-0.6px', fontWeight: '400' }],
      },

      // === 3. 폰트 패밀리 ===
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },

      // === 4. 간격 (Spacing) ===
      spacing: {
        'spacing-025':  '2px',
        'spacing-050':  '4px',
        'spacing-075':  '6px',
        'spacing-100':  '8px',
        'spacing-150':  '12px',
        'spacing-200':  '16px',
        'spacing-250':  '20px',
        'spacing-300':  '24px',
        'spacing-400':  '32px',
        'spacing-500':  '40px',
        'spacing-600':  '48px',
        'spacing-800':  '64px',
        'spacing-1000': '80px',
      },

      // === 5. 모서리 둥글기 (Border Radius) ===
      borderRadius: {
        'radius-4':    '4px',
        'radius-6':    '6px',
        'radius-8':    '8px',
        'radius-10':   '10px',
        'radius-12':   '12px',
        'radius-16':   '16px',
        'radius-20':   '20px',
        'radius-24':   '24px',
        'radius-full': '999px',
      },

    }
  },

  // [plugins] 추가 플러그인이 필요하면 여기에 등록
  plugins: [],
}
