import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TextInputSection from './components/TextInputSection';
import StatCards from './components/StatCards';
import LetterDensity from './components/LetterDensity';

/**
 * 앱 전체 상태의 단일 소유자(Single Source of Truth).
 * `text`와 파생 값을 여러 컴포넌트가 공유하므로 상태를 여기에 집중시키고 props로 배포합니다.
 * 새 기능 추가 시 상태 선언과 계산 로직은 이 파일에 추가하세요.
 */
const App = () => {

  const [isDark, setIsDark] = useState(true);
  const [text, setText] = useState('');
  const [excludeSpaces, setExcludeSpaces] = useState(false);
  const [hasCharLimit, setHasCharLimit] = useState(false);
  const [charLimit, setCharLimit] = useState(300);
  const [showAllLetters, setShowAllLetters] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // CSS :focus-visible 가상 클래스만으로는 커스텀 스타일 요소에서 브라우저 간 동작이 불일치할 수 있어,
  // JS 레벨에서 직접 입력 방식(키보드 vs 마우스)을 감지해 포커스 링 표시 여부를 제어합니다.
  useEffect(() => {
    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      setIsKeyboardFocused(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Tailwind darkMode: 'class' 전략은 <html class="dark"> 유무로 전체 테마를 전환합니다.
  // 색상 토큰을 수정하려면 tailwind.config.js의 colors 섹션을 참고하세요.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // 매 렌더링마다 재계산되지 않도록 useMemo로 메모이제이션합니다.
  // excludeSpaces 활성화 시 \s(스페이스·탭·줄바꿈 전부 포함)를 제거하고 카운트합니다.
  const charCount = useMemo(() => {
    if (excludeSpaces) return text.replace(/\s/g, '').length;
    return text.length;
  }, [text, excludeSpaces]);

  // \s+: 하나 이상의 연속된 공백을 단일 구분자로 처리해 다중 공백이 단어 수를 부풀리지 않도록 합니다.
  const wordCount = useMemo(() => {
    if (text.trim() === '') return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [text]);

  // [.!?]+: 연속된 구두점(예: "...!", "?!")을 하나의 문장 구분자로 처리합니다.
  const sentenceCount = useMemo(() => {
    if (text.trim() === '') return 0;
    return text.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }, [text]);

  const readingTime = useMemo(() => {
    if (wordCount === 0) return '0 minute';
    const rawMinutes = wordCount / 200;
    if (rawMinutes < 1) return '<1 minute';
    const minutes = Math.ceil(rawMinutes);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }, [wordCount]);

  // [^a-z]: 한글·숫자·특수문자 등 영문 알파벳 외 문자를 모두 제거합니다.
  // toFixed(2) → parseFloat: 소수점 2자리 반올림 후 후행 0을 제거합니다(예: 10.00 → 10).
  const letterDensityData = useMemo(() => {
    const onlyLetters = text.toLowerCase().replace(/[^a-z]/g, '');
    if (onlyLetters.length === 0) return [];

    const counts = {};
    for (const char of onlyLetters) {
      counts[char] = (counts[char] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([letter, count]) => ({
        letter: letter.toUpperCase(),
        count,
        percent: parseFloat(((count / onlyLetters.length) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
  }, [text]);

  const isOverLimit = hasCharLimit && charCount > charLimit;

  const toggleTheme = () => setIsDark(prev => !prev);

  // parseInt 실패(NaN)이거나 0 이하 입력은 무시해 유효하지 않은 제한값을 방지합니다.
  const handleLimitChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setCharLimit(val);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat transition-colors duration-75"
      style={{
        backgroundImage: isDark
          ? 'url(/images/bg-dark-theme.png)'
          : 'url(/images/bg-light-theme.png)',
      }}
    >
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main
        className="
          max-w-[375px] md:max-w-[768px] lg:max-w-[990px] mx-auto
          px-spacing-200 md:px-spacing-400 lg:px-0 lg:pt-spacing-600 lg:pb-spacing-800 pt-spacing-500 md:pb-[93px] pb-spacing-400
          flex flex-col gap-spacing-500 lg:gap-spacing-600
        "
        aria-label="Character Counter 메인 콘텐츠"
      >
        <h1 className="text-preset-1-mobile md:text-preset-1 text-neutral-900 dark:text-neutral-100 text-center">
          Analyze your text<br />in real&#8209;time.
          {/* &#8209; = non-breaking hyphen. 제목이 "real-" / "time."으로 줄바꿈되지 않도록 합니다. */}
        </h1>

        <TextInputSection
          text={text}
          setText={setText}
          excludeSpaces={excludeSpaces}
          setExcludeSpaces={setExcludeSpaces}
          hasCharLimit={hasCharLimit}
          setHasCharLimit={setHasCharLimit}
          charLimit={charLimit}
          handleLimitChange={handleLimitChange}
          isOverLimit={isOverLimit}
          charCount={charCount}
          readingTime={readingTime}
          isKeyboardUser={isKeyboardUser}
          isKeyboardFocused={isKeyboardFocused}
          setIsKeyboardFocused={setIsKeyboardFocused}
        />

        <StatCards
          charCount={charCount}
          wordCount={wordCount}
          sentenceCount={sentenceCount}
          excludeSpaces={excludeSpaces}
        />

        <LetterDensity
          letterDensityData={letterDensityData}
          showAllLetters={showAllLetters}
          setShowAllLetters={setShowAllLetters}
        />

      </main>
    </div>
  );
};

export default App;
