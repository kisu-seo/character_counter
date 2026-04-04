// [Vite 설정 파일]
// Vite가 프로젝트를 어떻게 빌드/실행할지 설정합니다.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // [plugins] React JSX 문법을 처리하기 위한 플러그인 등록
  plugins: [react()],
});
