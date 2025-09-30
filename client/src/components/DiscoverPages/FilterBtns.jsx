export default function FilterBtns({ title, expanded, onClick, providerLength, children }) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
          expanded ? "rounded-b-none" : ""
        } bg-gray-800/80 
            hover:bg-gray-700/80 transition-colors shadow text-white font-semibold text-base cursor-pointer`}
      >
        <span className="flex items-center gap-2">{title}</span>
        <span className="flex items-center gap-1">
          {providerLength && (
            <span className="bg-gray-600 text-primary-2 text-sm px-3 rounded-lg">
              {providerLength}
            </span>
          )}
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-transform duration-200 ${
              expanded ? "rotate-360" : "rotate-270"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {expanded && <div className="bg-gray-800/80 rounded-b-lg p-4">{children}</div>}
    </div>
  );
}
