/**
 * 로고와 테마 전환 버튼을 담당합니다.
 * @param {boolean} isDark - 로고 이미지 경로, 아이콘 종류, aria-label 문구를 모두 이 값 하나로 결정합니다.
 * @param {function} toggleTheme - App의 isDark 상태를 토글합니다.
 */
const Header = ({ isDark, toggleTheme }) => {
  return (
    <header
      className="bg-neutral-0 dark:bg-transparent w-full"
      role="banner"
    >
      <div className="
        max-w-[375px] md:max-w-[768px] lg:max-w-[990px] mx-auto
        flex items-center justify-between
        p-spacing-200 md:px-spacing-400 lg:px-0 lg:pt-spacing-400 lg:pb-0
      ">
        <div className="flex items-center gap-spacing-100">
          {/* 로고 이미지를 교체하려면 public/images/ 폴더의 파일을 변경하세요. */}
          <img
            src={isDark ? `${import.meta.env.BASE_URL}images/logo-dark-theme.svg` : `${import.meta.env.BASE_URL}images/logo-light-theme.svg`}
            alt="Character Counter 로고"
            className="h-8 w-auto md:w-[246px] md:h-10"
          />
        </div>

        <button
          onClick={toggleTheme}
          aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className="
            p-spacing-100
            bg-neutral-100 dark:bg-neutral-700
            lg:hover:bg-neutral-200 dark:lg:hover:bg-neutral-600
            rounded-radius-8
            transition-all duration-75
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          "
        >
          <img
            src={isDark ? `${import.meta.env.BASE_URL}images/icon-sun.svg` : `${import.meta.env.BASE_URL}images/icon-moon.svg`}
            alt={isDark ? '태양 아이콘' : '달 아이콘'}
            className="w-5 h-5"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
