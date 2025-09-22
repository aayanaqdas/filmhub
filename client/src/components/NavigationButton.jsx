export default function NavigationButton({ direction, onClick }) {
  const isPrev = direction === "prev";

  return (
    <button
      onClick={onClick}
      className={`absolute top-0 bottom-0 w-16 z-30 cursor-pointer transition-all duration-300 ${
        isPrev
          ? "left-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent"
          : "right-0 bg-gradient-to-l from-background/80 via-background/50 to-transparent"
      } flex items-center justify-center text-white group`}
    >
      <svg
        className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isPrev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}
