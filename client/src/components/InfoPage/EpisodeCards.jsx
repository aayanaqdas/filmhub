import noImg from "../../assets/no_image.svg";

export default function EpisodeCard({ episode, isExpanded, onToggle }) {
  const baseImgUrl = "https://image.tmdb.org/t/p/w500";

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "TBA";
    }
  };

  const formatRuntime = (runtime) => {
    if (!runtime) return null;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl overflow-hidden hover:border-primary-2/50 transition-all duration-300">
      {/* Episode Header */}
      <div
        className="flex items-center p-4 cursor-pointer hover:bg-gray-700/30 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700 mr-4">
          <img
            src={episode.still_path ? `${baseImgUrl}${episode.still_path}` : noImg}
            alt={episode.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-primary-2 font-bold text-lg">{episode.episode_number}</span>
            <h3 className="text-white font-semibold text-lg truncate">{episode.name}</h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{formatDate(episode.air_date)}</span>
            {episode.runtime && <span>{formatRuntime(episode.runtime)}</span>}
            {episode.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{episode.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <div className="w-5 h-5 text-gray-400 flex items-center justify-center">
            {isExpanded ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
