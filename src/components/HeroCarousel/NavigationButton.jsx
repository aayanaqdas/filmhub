export default function NavigationButton({ direction, onClick }) {
  const isPrev = direction === "prev";

  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-primary-2 p-2 md:p-3 rounded-full transition-all duration-200 z-20 group cursor-pointer ${
        isPrev ? "left-2 md:left-4" : "right-2 md:right-4"
      }`}
    >
      <svg
        className={`w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform ${
          isPrev ? "transform rotate-180" : ""
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
