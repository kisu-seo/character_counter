/**
 * 텍스트 입력부터 옵션 설정까지, 사용자 입력 관련 UI 전체를 통합합니다.
 * @param {boolean} isOverLimit - true일 때 textarea 테두리 색상과 경고 메시지가 동시에 전환됩니다.
 * @param {boolean} isKeyboardUser / isKeyboardFocused - App에서 전역으로 감지한 입력 방식 상태입니다.
 *   마우스 클릭에는 포커스 링을 표시하지 않기 위해 별도로 내려받습니다.
 */
const TextInputSection = ({
  text,
  setText,
  excludeSpaces,
  setExcludeSpaces,
  hasCharLimit,
  setHasCharLimit,
  charLimit,
  handleLimitChange,
  isOverLimit,
  charCount,
  readingTime,
  isKeyboardUser,
  isKeyboardFocused,
  setIsKeyboardFocused,
}) => {
  // 두 체크박스의 Tailwind 클래스가 완전히 동일하므로, 스타일 변경 시 한 곳만 수정하도록 추출했습니다.
  const checkboxClass = `
    w-4 h-4 appearance-none bg-transparent
    border border-neutral-600 dark:border-neutral-200
    rounded-radius-4
    focus-visible:border-neutral-200 dark:focus-visible:bg-white dark:focus-visible:border-neutral-200
    checked:bg-blue-500 checked:border-blue-500 dark:checked:bg-blue-400 dark:checked:border-blue-400
    cursor-pointer transition-colors duration-75
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-white
  `;

  return (
    <section aria-label="텍스트 입력 영역">

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        // App의 handleMouseDown에서 이미 isKeyboardUser를 false로 리셋하므로,
        // 마우스 클릭으로 포커스될 때는 이 조건이 false가 되어 포커스 링이 표시되지 않습니다.
        onFocus={() => { if (isKeyboardUser) setIsKeyboardFocused(true); }}
        onBlur={() => setIsKeyboardFocused(false)}
        className={`
          w-full h-48 p-spacing-200
          bg-neutral-100 dark:bg-neutral-800 lg:hover:bg-neutral-200 dark:lg:hover:bg-neutral-700
          text-neutral-700 dark:text-neutral-200
          placeholder:text-neutral-700 dark:placeholder:text-neutral-200
          rounded-radius-12 text-preset-3 resize-none cursor-pointer
          focus:outline-none focus:ring-0
          transition-colors duration-150 border-2
          ${isOverLimit
            ? 'border-orange-800 dark:border-orange-500 shadow-[0px_0px_8px_0px_rgba(254,129,89,1)]'
            : isKeyboardFocused
              ? 'border-blue-500 shadow-[0px_0px_10px_0px_rgba(194,124,248,1)]'
              : 'border-neutral-200 lg:hover:border-neutral-200 dark:border-neutral-700 dark:lg:hover:border-neutral-600 shadow-[0px_2px_5px_0px_rgba(15,15,15,0.04)]'
          }
        `}
        placeholder="Start typing here... (or paste your text)"
        aria-label="분석할 텍스트 입력창"
        aria-invalid={isOverLimit}
      />

      {isOverLimit && (
        <p
          className="mt-spacing-150 text-preset-4 text-orange-800 dark:text-orange-500 flex items-center gap-spacing-075"
          role="alert"
          aria-live="polite"
        >
          <img src="/images/icon-info.svg" alt="" aria-hidden="true" className="w-4 h-4 shrink-0" />
          Limit reached! Your text exceeds {charCount - charLimit} characters.
        </p>
      )}

      <div className="mt-spacing-200 flex flex-col md:flex-row md:items-center gap-spacing-150 md:gap-spacing-300">

        <label className="flex items-center gap-[10px] text-preset-4 text-neutral-900 dark:text-neutral-200 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={excludeSpaces}
            onChange={(e) => setExcludeSpaces(e.target.checked)}
            className={checkboxClass}
            aria-label="공백을 제외하여 글자 수 계산"
          />
          Exclude Spaces
        </label>

        <div className="flex items-center gap-[10px] flex-wrap">
          <label className="flex items-center gap-[10px] text-preset-4 text-neutral-900 dark:text-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={hasCharLimit}
              onChange={(e) => setHasCharLimit(e.target.checked)}
              className={checkboxClass}
              aria-label="최대 글자 수 제한 설정"
            />
            Set Character Limit
          </label>

          {/* display:none 대신 opacity/visibility를 사용해 체크 해제 시에도 레이아웃 공간을 유지합니다.
              숫자 입력창이 사라질 때 옆 요소들이 흔들리는 레이아웃 시프트를 방지하기 위해서입니다. */}
          <input
            type="number"
            value={charLimit}
            onChange={handleLimitChange}
            min="1"
            className={`
              w-[55px] h-[29px]
              bg-transparent
              text-neutral-900 dark:text-neutral-0
              border border-neutral-600
              rounded-radius-6 text-preset-4 text-center
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
              ${hasCharLimit ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
            `}
            aria-label="글자 수 제한 숫자 입력"
          />
        </div>

        {/* md:ml-auto가 남은 flex 공간을 모두 흡수해 이 요소를 오른쪽 끝으로 밀어냅니다. */}
        <p className="text-preset-4 text-neutral-900 dark:text-neutral-200 whitespace-nowrap md:ml-auto">
          Approx. reading time: {readingTime}
        </p>
      </div>

    </section>
  );
};

export default TextInputSection;
