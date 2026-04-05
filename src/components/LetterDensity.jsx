/**
 * 알파벳 빈도를 프로그레스 바로 시각화합니다.
 * @param {array} letterDensityData - App에서 이미 빈도 내림차순 정렬된 상태로 넘어옵니다.
 *   이 정렬 순서를 전제로 [0] 인덱스를 최댓값으로 사용하므로, 정렬 로직 변경 시 getBarWidth도 함께 수정하세요.
 * @param {boolean} showAllLetters / setShowAllLetters - 5개 제한과 전체 펼치기 상태를 제어합니다.
 */
const LetterDensity = ({ letterDensityData, showAllLetters, setShowAllLetters }) => {

  const displayedLetters = showAllLetters
    ? letterDensityData
    : letterDensityData.slice(0, 5);

  // 절대 퍼센트(%)가 아닌 상대 너비를 사용하는 이유: 가장 빈도 높은 글자가 항상 바를 꽉 채워
  // 시각적 대비가 명확하게 보이도록 하기 위해서입니다(예: 최고 빈도 10% → 바 너비 100%).
  const maxPercent = letterDensityData.length > 0 ? letterDensityData[0].percent : 1;
  const getBarWidth = (percent) => `${(percent / maxPercent) * 100}%`;

  return (
    <section aria-label="글자 밀도 분석" className="mt-[-16px] lg:mt-[-24px]">

      <h2 className="text-preset-2 text-neutral-900 dark:text-neutral-200 mb-spacing-250">
        Letter Density
      </h2>

      {letterDensityData.length === 0 ? (
        <p className="text-preset-4 text-neutral-600 dark:text-neutral-200 text-left p-0">
          No characters found. Start typing to see letter density.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-spacing-150" role="list">
            {displayedLetters.map(({ letter, count, percent }) => (
              <div
                key={letter}
                className="flex items-center gap-[14px]"
                role="listitem"
                aria-label={`글자 ${letter}: ${count}개 (${percent}%)`}
              >
                <span className="text-preset-4 font-medium text-neutral-900 dark:text-neutral-200 w-4 text-center shrink-0">
                  {letter}
                </span>
                <div
                  className="w-[212px] md:flex-1 h-[12px] bg-neutral-100 dark:bg-neutral-800 rounded-radius-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-blue-400 rounded-radius-full transition-all duration-500"
                    style={{ width: getBarWidth(percent) }}
                  />
                </div>
                <span className="text-preset-4 text-neutral-900 dark:text-neutral-200 w-[87px] text-right shrink-0">
                  {count} ({percent}%)
                </span>
              </div>
            ))}
          </div>

          {letterDensityData.length > 5 && (
            <button
              onClick={() => setShowAllLetters(prev => !prev)}
              className="
                mt-spacing-300 md:mt-spacing-250
                flex items-center gap-spacing-075
                text-preset-4 text-neutral-900 dark:text-neutral-0
                rounded-radius-4 transition-all duration-75
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              "
              aria-expanded={showAllLetters}
              aria-label={showAllLetters ? '글자 밀도 접기' : '글자 밀도 전체 보기'}
            >
              {showAllLetters ? 'See less' : 'See more'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                  transform: showAllLetters ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </>
      )}

    </section>
  );
};

export default LetterDensity;
