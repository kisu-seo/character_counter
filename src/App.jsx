// [React Hook 불러오기]
// useState  : 변하는 데이터(상태)를 저장하는 도구
// useEffect : 상태가 바뀔 때 부수적인 작업을 실행하는 도구
// useMemo   : 복잡한 계산 결과를 저장해두고, 관련 값이 바뀔 때만 다시 계산하는 도구
import { useState, useEffect, useMemo } from 'react';

// ============================================================
// [컴포넌트] App - 전체 앱의 최상위(루트) 컴포넌트
// ============================================================
const App = () => {

  // ── 상태(State) 선언부 ──────────────────────────────────────

  // [상태] 다크모드 여부 (true = 다크, false = 라이트, 기본값: 다크)
  const [isDark, setIsDark] = useState(true);

  // [상태] textarea에 입력된 텍스트 전체 (기본값: 빈 문자열)
  const [text, setText] = useState('');

  // [상태] "Exclude Spaces" 체크 여부 (공백을 글자 수에서 제외할지)
  const [excludeSpaces, setExcludeSpaces] = useState(false);

  // [상태] "Set Character Limit" 체크 여부 (글자 수 제한 기능 켜기/끄기)
  const [hasCharLimit, setHasCharLimit] = useState(false);

  // [상태] 글자 수 제한값 (기본 300자)
  const [charLimit, setCharLimit] = useState(300);

  // [상태] "See more" 버튼으로 모든 글자 밀도를 펼칠지 여부
  const [showAllLetters, setShowAllLetters] = useState(false);

  // ── 부수 효과(Effect) ────────────────────────────────────────

  // [효과] isDark 상태가 바뀔 때마다 html 태그에 'dark' 클래스를 추가/제거
  // Tailwind의 darkMode: 'class' 방식은 html 태그의 'dark' 클래스로 작동함
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // ── 실시간 계산(Derived State) ───────────────────────────────

  // [계산 1] 글자 수
  // useMemo: text나 excludeSpaces가 바뀔 때만 다시 계산 (성능 최적화)
  const charCount = useMemo(() => {
    // "공백 제외" 체크 시: 모든 공백문자(\s)를 제거하고 길이 반환
    if (excludeSpaces) return text.replace(/\s/g, '').length;
    // 기본: 텍스트 전체 길이 반환
    return text.length;
  }, [text, excludeSpaces]);

  // [계산 2] 단어 수
  // \s+ : 하나 이상의 공백 문자 (스페이스, 탭, 줄바꿈 등)
  // .filter(Boolean) : 빈 문자열('')을 걸러냄
  const wordCount = useMemo(() => {
    if (text.trim() === '') return 0; // 텍스트가 비었으면 0
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [text]);

  // [계산 3] 문장 수
  // [.!?]+ : 마침표, 느낌표, 물음표 중 하나 이상 연속으로 나오는 패턴
  // .split(...).filter(s => s.trim()) : 분리 후 내용 없는 빈 조각 제거
  const sentenceCount = useMemo(() => {
    if (text.trim() === '') return 0; // 텍스트가 비었으면 0
    return text.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }, [text]);

  // [계산 4] 예상 읽기 시간
  // 성인 평균 독서 속도: 분당 약 200 단어
  const readingTime = useMemo(() => {
    // 단어가 하나도 없을 때
    if (wordCount === 0) return '0 minute';

    // 성인 평균 독서 속도(분당 200단어)로 계산
    const rawMinutes = wordCount / 200;

    // 1분 미만일 경우 처리
    if (rawMinutes < 1) return '<1 minute';

    // 그 이상일 경우 올림 처리하여 표시
    const minutes = Math.ceil(rawMinutes);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }, [wordCount]);

  // [계산 5] 글자 밀도 (Letter Density) - 알파벳 빈도 분석
  const letterDensityData = useMemo(() => {
    // 영문 소문자만 추출: 대소문자 구분 없이, 알파벳 외 문자(숫자, 공백 등) 제거
    const onlyLetters = text.toLowerCase().replace(/[^a-z]/g, '');
    if (onlyLetters.length === 0) return []; // 알파벳이 없으면 빈 배열 반환

    // 각 알파벳의 등장 횟수를 객체에 누적
    // 예: { 'h': 3, 'e': 5, 'l': 8, ... }
    const counts = {};
    for (const char of onlyLetters) {
      counts[char] = (counts[char] || 0) + 1;
    }

    // 객체를 배열로 변환하고, 비율(퍼센트) 계산 후 빈도 내림차순 정렬
    return Object.entries(counts)
      .map(([letter, count]) => ({
        letter: letter.toUpperCase(),
        count,
        // toFixed(2): 소수점 둘째자리까지 반올림 → parseFloat: 불필요한 0 제거
        percent: parseFloat(((count / onlyLetters.length) * 100).toFixed(2)),
      }))
      // 빈도 높은 순으로 정렬, 같으면 알파벳 순으로 정렬
      .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
  }, [text]);

  // [계산 6] 글자 제한 초과 여부 (hasCharLimit이 켜져 있고 글자 수가 제한을 넘었을 때)
  const isOverLimit = hasCharLimit && charCount > charLimit;

  // [계산 7] 화면에 표시할 글자 밀도 목록
  // showAllLetters가 false면 상위 5개만, true면 전부 표시
  const displayedLetters = showAllLetters
    ? letterDensityData
    : letterDensityData.slice(0, 5);

  // [계산 8] 프로그레스 바 너비
  // 가장 많이 등장한 글자(배열 첫 번째)를 100% 기준으로 상대적 너비 계산
  const maxPercent = letterDensityData.length > 0 ? letterDensityData[0].percent : 1;
  const getBarWidth = (percent) => `${(percent / maxPercent) * 100}%`;

  // ── 이벤트 핸들러 ────────────────────────────────────────────

  // [함수] 다크/라이트 모드 전환
  const toggleTheme = () => setIsDark(prev => !prev);

  // [함수] 글자 수 제한 입력 처리
  // 음수 방지 + 최소 1자 보장
  const handleLimitChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setCharLimit(val);
  };

  return (
    // [최상위 래퍼] 배경 이미지 + 최소 전체 화면 높이 설정
    // isDark 상태에 따라 다크/라이트 배경 이미지를 동적으로 교체
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat transition-colors duration-75"
      style={{
        backgroundImage: isDark
          ? 'url(/images/bg-dark-theme.png)'   // 다크모드 배경 이미지
          : 'url(/images/bg-light-theme.png)'  // 라이트모드 배경 이미지
      }}
    >

      {/* ====================================================
          헤더 영역
          - 좌측: 로고 이미지 + 서비스 이름
          - 우측: 다크/라이트 모드 토글 버튼
      ===================================================== */}
      <header
        className="
          flex items-center justify-between
          p-spacing-200
          bg-neutral-0 dark:bg-transparent
        "
        role="banner"
      >
        {/* 로고 + 서비스 이름 묶음 */}
        <div className="flex items-center gap-spacing-100">
          {/* 로고 이미지: 다크/라이트 모드에 따라 다른 파일 사용 */}
          <img
            src={isDark ? '/images/logo-dark-theme.svg' : '/images/logo-light-theme.svg'}
            alt="Character Counter 로고"
            className="h-8 w-auto"
          />
        </div>

        {/* 테마 전환 버튼: 다크모드일 때 태양(☀) 아이콘, 라이트모드일 때 달(☽) 아이콘 표시 */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className="
            p-spacing-100
            bg-neutral-100 dark:bg-neutral-700
            hover:bg-neutral-200 dark:hover:bg-neutral-600
            rounded-radius-8
            transition-all duration-75
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          "
        >
          <img
            src={isDark ? '/images/icon-sun.svg' : '/images/icon-moon.svg'}
            alt={isDark ? '태양 아이콘' : '달 아이콘'}
            className="w-5 h-5"
          />
        </button>
      </header>

      {/* ====================================================
          메인 콘텐츠 영역
          - max-w-[375px]: 모바일 화면 너비 기준으로 최대 너비 제한
          - mx-auto: 가로 가운데 정렬
          - flex flex-col gap: 자식 요소들을 위→아래로 쌓고 간격 설정
      ===================================================== */}
      <main
        className="
          max-w-[375px] mx-auto
          px-spacing-200 pt-spacing-500 pb-spacing-400
          flex flex-col gap-spacing-500
        "
        aria-label="Character Counter 메인 콘텐츠"
      >

        {/* [타이틀] 메인 헤딩 - Text Preset 1 Mobile(40px, Bold) 적용 */}
        <h1 className="text-preset-1-mobile text-neutral-900 dark:text-neutral-100 text-center">
          Analyze your text<br />in real&#8209;time.
          {/* &#8209; = 줄바꿈 없는 하이픈(non-breaking hyphen) */}
        </h1>

        {/* ====================================================
            입력 섹션 (Textarea + 옵션 체크박스 + 읽기 시간)
        ===================================================== */}
        <section aria-label="텍스트 입력 영역">

          {/* 텍스트 에리어: value={text}로 React 상태와 연결, onChange로 실시간 감지 */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`
              w-full h-48 p-spacing-200
              bg-neutral-100 dark:bg-neutral-800
              text-neutral-700 dark:text-neutral-200
              placeholder:text-neutral-700 dark:placeholder:text-neutral-200
              rounded-radius-12 text-preset-3 resize-none shadow-[0px_2px_5px_0px_rgba(15,15,15,0.04)]
              focus:outline-none focus:ring-2 focus:border-transparent
              transition-colors duration-75 border-2
              ${isOverLimit
                ? 'border-orange-800 focus:ring-orange-800'       // 제한 초과: 빨간 테두리
                : 'border-neutral-200 dark:border-neutral-700 focus:ring-blue-500' // 정상: 회색 → 보라 포커스
              }
            `}
            placeholder="Start typing here... (or paste your text)"
            aria-label="분석할 텍스트 입력창"
            aria-invalid={isOverLimit}
          />

          {/* 글자 수 제한 초과 경고 메시지 (isOverLimit이 true일 때만 표시) */}
          {isOverLimit && (
            <p
              className="mt-spacing-075 text-preset-4 text-orange-800 flex items-center gap-spacing-075"
              role="alert"
              aria-live="polite"
            >
              <img src="/images/icon-info.svg" alt="" aria-hidden="true" className="w-4 h-4 shrink-0" />
              {/* charCount - charLimit : 얼마나 초과했는지 계산 */}
              글자 수 제한을 {charCount - charLimit}자 초과했습니다.
            </p>
          )}

          {/* 체크박스 옵션 목록: spacing-200(16px)을 적용해 입력창과의 거리를 넓혔습니다 */}
          <div className="mt-spacing-200 flex flex-col gap-spacing-150">

            {/* 체크박스 1: 공백 제외 */}
            {/* checked={excludeSpaces}: 체크박스가 상태와 동기화됨 */}
            {/* onChange: 체크 여부가 바뀔 때 excludeSpaces 상태를 업데이트 */}
            <label className="flex items-center gap-[10px] text-preset-4 text-neutral-900 dark:text-neutral-200 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={excludeSpaces}
                onChange={(e) => setExcludeSpaces(e.target.checked)}
                className="w-4 h-4 appearance-none bg-transparent border border-neutral-600 dark:border-neutral-200 rounded-radius-4 checked:bg-blue-500 checked:border-blue-500 dark:checked:bg-blue-400 dark:checked:border-blue-400 cursor-pointer transition-colors duration-75"
                aria-label="공백을 제외하여 글자 수 계산"
              />
              Exclude Spaces
            </label>

            {/* 체크박스 2: 글자 수 제한 + 체크 시 숫자 입력 필드 등장 */}
            <div className="flex items-center gap-[10px] flex-wrap">
              <label className="flex items-center gap-[10px] text-preset-4 text-neutral-900 dark:text-neutral-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCharLimit}
                  onChange={(e) => setHasCharLimit(e.target.checked)}
                  className="w-4 h-4 appearance-none bg-transparent border border-neutral-600 dark:border-neutral-200 rounded-radius-4 checked:bg-blue-500 checked:border-blue-500 dark:checked:bg-blue-400 dark:checked:border-blue-400 cursor-pointer transition-colors duration-75"
                  aria-label="최대 글자 수 제한 설정"
                />
                Set Character Limit
              </label>

              {/* hasCharLimit이 true일 때만 숫자 입력 필드 표시 */}
              {hasCharLimit && (
                <input
                  type="number"
                  value={charLimit}
                  onChange={handleLimitChange}
                  min="1"
                  className="
                    w-20 px-spacing-100 py-spacing-025
                    bg-neutral-0 dark:bg-neutral-700
                    text-neutral-900 dark:text-neutral-0
                    border border-neutral-200 dark:border-neutral-600
                    rounded-radius-6 text-preset-4
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-all duration-75
                  "
                  aria-label="글자 수 제한 숫자 입력"
                />
              )}
            </div>
          </div>

          {/* 예상 읽기 시간: readingTime 계산값으로 실시간 업데이트 */}
          <p className="mt-spacing-150 text-preset-4 text-neutral-900 dark:text-neutral-200">
            Approx. reading time: {readingTime}
          </p>
        </section>

        {/* ====================================================
            통계 카드 섹션 (3개 카드: 보라/노랑/주황)
        ===================================================== */}
        <section aria-label="텍스트 분석 통계" className="flex flex-col gap-spacing-200">

          {/* ── 카드 1: Total Characters ─ 보라색 ── */}
          <div className="relative overflow-hidden bg-blue-400 rounded-radius-16 py-[27px] px-spacing-250 min-h-[120px]">
            <img src="/images/pattern-character-count.svg" alt="" aria-hidden="true"
              className="absolute right-[-42px] top-0 h-full w-auto object-cover" />
            <div className="relative z-10 flex flex-col gap-spacing-100">
              {/* String().padStart(2, '0'): 수치가 0일 때 '00'으로, 한 자리 수일 때 앞에 0을 붙여 일관되게 표시합니다 */}
              <p className="text-preset-1-mobile text-neutral-900" aria-label={`전체 글자 수: ${charCount}`}>
                {String(charCount).padStart(2, '0')}
              </p>
              <p className="text-preset-3 text-neutral-900">Total Characters</p>
            </div>
          </div>

          {/* ── 카드 2: Word Count ─ 노란색 ── */}
          <div className="relative overflow-hidden bg-yellow-500 rounded-radius-16 py-[27px] px-spacing-250 min-h-[120px]">
            <img src="/images/pattern-word-count.svg" alt="" aria-hidden="true"
              className="absolute right-[-42px] top-0 h-full w-auto object-cover" />
            <div className="relative z-10 flex flex-col gap-spacing-100">
              <p className="text-preset-1-mobile text-neutral-900" aria-label={`단어 수: ${wordCount}`}>
                {String(wordCount).padStart(2, '0')}
              </p>
              <p className="text-preset-3 text-neutral-900">Word Count</p>
            </div>
          </div>

          {/* ── 카드 2: Sentence Count ─ 주황색 ── */}
          <div className="relative overflow-hidden bg-orange-500 rounded-radius-16 py-[27px] px-spacing-250 min-h-[120px]">
            <img src="/images/pattern-sentence-count.svg" alt="" aria-hidden="true"
              className="absolute right-[-42px] top-0 h-full w-auto object-cover" />
            <div className="relative z-10 flex flex-col gap-spacing-100">
              <p className="text-preset-1-mobile text-neutral-900" aria-label={`문장 수: ${sentenceCount}`}>
                {String(sentenceCount).padStart(2, '0')}
              </p>
              <p className="text-preset-3 text-neutral-900">Sentence Count</p>
            </div>
          </div>

        </section>

        {/* ====================================================
            글자 밀도 섹션 (Letter Density)
            - 디자인 균형을 위해 섹션을 위로 -16px만큼 살짝 끌어올렸습니다
        ===================================================== */}
        <section aria-label="글자 밀도 분석" className="mt-[-16px]">

          <h2 className="text-preset-2 text-neutral-900 dark:text-neutral-200 mb-spacing-250">
            Letter Density
          </h2>

          {/* 텍스트가 없을 때 안내 문구 표시 */}
          {letterDensityData.length === 0 ? (
            <p className="text-preset-4 text-neutral-600 dark:text-neutral-200 text-left p-0">
              No characters found. Start typing to see letter density.
            </p>
          ) : (
            <>
              {/* 글자별 프로그레스 바 목록 */}
              {/* displayedLetters: showAllLetters 상태에 따라 5개 또는 전체 표시 */}
              <div className="flex flex-col gap-spacing-150" role="list">
                {displayedLetters.map(({ letter, count, percent }) => (
                  <div
                    key={letter}
                    className="flex items-center gap-[14px]"
                    role="listitem"
                    aria-label={`글자 ${letter}: ${count}개 (${percent}%)`}
                  >
                    {/* 알파벳 */}
                    <span className="text-preset-4 font-medium text-neutral-900 dark:text-neutral-200 w-4 text-center shrink-0">
                      {letter}
                    </span>

                    {/* 프로그레스 바 트랙 */}
                    <div
                      className="w-[212px] h-[12px] bg-neutral-100 dark:bg-neutral-800 rounded-radius-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {/* 채움 바: getBarWidth()로 계산한 상대적 너비 + 부드러운 애니메이션 */}
                      <div
                        className="h-full bg-blue-400 rounded-radius-full transition-all duration-500"
                        style={{ width: getBarWidth(percent) }}
                      />
                    </div>

                    {/* 수치 텍스트 */}
                    <span className="text-preset-4 text-neutral-900 dark:text-neutral-200 w-[87px] text-right shrink-0">
                      {count} ({percent}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* "See more / See less" 버튼: 알파벳이 6개 이상일 때만 표시 */}
              {letterDensityData.length > 5 && (
                <button
                  onClick={() => setShowAllLetters(prev => !prev)}
                  className="
                    mt-spacing-300
                    flex items-center gap-spacing-075
                    text-preset-4 text-neutral-900 dark:text-neutral-0
                    rounded-radius-4 transition-all duration-75
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  "
                  aria-expanded={showAllLetters}
                  aria-label={showAllLetters ? '글자 밀도 접기' : '글자 밀도 전체 보기'}
                >
                  {showAllLetters ? 'See less' : 'See more'}
                  {/* 화살표 방향: 펼쳐진 상태면 위(↑), 접힌 상태면 아래(↓) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ transform: showAllLetters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              )}
            </>
          )}

        </section>

      </main>
    </div>
  );
};

// [내보내기] 다른 파일(main.jsx)에서 이 컴포넌트를 불러올 수 있도록 내보냄
export default App;
