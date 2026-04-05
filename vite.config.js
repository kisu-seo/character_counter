import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages는 https://<user>.github.io/<repo>/ 형태의 서브경로에서 서빙됩니다.
  // base를 레포지토리 이름으로 지정하지 않으면 JS/CSS 에셋 경로가 루트(/)를 기준으로
  // 빌드되어 404가 발생하고 빈 화면이 됩니다.
  base: '/character_counter/',
});
