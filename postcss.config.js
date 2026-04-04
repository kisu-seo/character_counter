// [PostCSS 설정]
// PostCSS는 CSS를 변환해주는 도구입니다.
// Tailwind CSS와 Autoprefixer를 플러그인으로 등록해서
// 빌드할 때 Tailwind 클래스가 실제 CSS로 변환되게 합니다.
export default {
  plugins: {
    // tailwindcss: Tailwind의 유틸리티 클래스를 실제 CSS로 변환
    tailwindcss: {},
    // autoprefixer: 구형 브라우저 호환을 위해 -webkit- 등 접두사를 자동으로 추가
    autoprefixer: {},
  },
}
