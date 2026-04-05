/**
 * 글자 수·단어 수·문장 수를 카드 형태로 시각화합니다.
 * @param {boolean} excludeSpaces - true일 때 글자 수 카드 레이블에 '(no space)' 텍스트가 추가됩니다.
 */
const StatCards = ({ charCount, wordCount, sentenceCount, excludeSpaces }) => {

  // 3개 카드의 구조가 동일하므로, 카드를 추가하거나 순서를 바꿀 때 이 배열만 수정하면 됩니다.
  const cards = [
    {
      count: charCount,
      label: `Total Characters${excludeSpaces ? ' (no space)' : ''}`,
      bg: 'bg-blue-400',
      pattern: '/images/pattern-character-count.svg',
      ariaLabel: `전체 글자 수: ${charCount}`,
    },
    {
      count: wordCount,
      label: 'Word Count',
      bg: 'bg-yellow-500',
      pattern: '/images/pattern-word-count.svg',
      ariaLabel: `단어 수: ${wordCount}`,
    },
    {
      count: sentenceCount,
      label: 'Sentence Count',
      bg: 'bg-orange-500',
      pattern: '/images/pattern-sentence-count.svg',
      ariaLabel: `문장 수: ${sentenceCount}`,
    },
  ];

  return (
    <section aria-label="텍스트 분석 통계" className="grid grid-cols-1 md:grid-cols-3 gap-spacing-200">
      {cards.map(({ count, label, bg, pattern, ariaLabel }) => (
        <div
          key={label}
          className={`relative overflow-hidden ${bg} rounded-radius-16 py-[27px] px-spacing-250 md:py-[25px] md:px-[12px] lg:px-spacing-200 min-h-[120px]`}
        >
          <img
            src={pattern}
            alt=""
            aria-hidden="true"
            className="absolute right-[-42px] md:right-[-70px] lg:right-[-30px] top-0 h-full w-auto object-cover"
          />
          <div className="relative z-10 flex flex-col gap-spacing-100">
            {/* padStart(2, '0'): 수치가 한 자리여도 '07'처럼 두 자리 포맷을 유지해 카드 간 레이아웃이 흔들리지 않습니다. */}
            <p className="text-preset-1-mobile md:text-preset-1 text-neutral-900" aria-label={ariaLabel}>
              {String(count).padStart(2, '0')}
            </p>
            <p className="text-preset-3 text-neutral-900">{label}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatCards;
