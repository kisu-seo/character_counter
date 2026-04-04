// [React 불러오기] JSX를 사용하려면 React가 스코프 안에 있어야 함
import React from 'react';

// [ReactDOM 불러오기] React 컴포넌트를 실제 HTML(DOM)에 그려주는 도구
import ReactDOM from 'react-dom/client';

// [App 컴포넌트 불러오기] 우리가 만든 앱 전체를 담은 최상위 컴포넌트
import App from './App';

// [전역 CSS 불러오기] Tailwind 지시어 + 커스텀 스타일이 담긴 파일
import './index.css';

// [앱 렌더링]
// document.getElementById('root') → index.html의 <div id="root"> 를 찾아
// 그 안에 <App /> 컴포넌트를 그려 넣음
// React.StrictMode → 개발 중 잠재적인 문제를 미리 경고해 주는 도우미 모드
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
