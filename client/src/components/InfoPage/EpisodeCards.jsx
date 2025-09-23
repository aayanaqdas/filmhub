import { useNavigate } from "react-router-dom";
import noImg from "../../assets/no_image.svg";

export default function EpisodeCard({ episode, isExpanded, onToggle }) {
  const baseImgUrl = "https://image.tmdb.org/t/p/w500";
  const navigate = useNavigate();

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

  const getVoteColor = (vote) => {
    if (vote >= 8) return "text-green-400";
    if (vote >= 6) return "text-yellow-400";
    if (vote >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const handlePersonClick = (personId, event) => {
    event.stopPropagation();
    navigate(`/person/${personId}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm flex flex-col border p-5 border-gray-600/30 rounded-xl overflow-hidden hover:border-primary-2/50 hover:shadow-lg hover:shadow-primary-2/10 transition-all duration-300">
      {/* Episode Header */}
      <div
        className="w-full flex flex-col justify-center md:flex-row md:items-center cursor-pointer group"
        onClick={onToggle}
      >
        <div className="w-full md:w-50 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700 mb-4 md:mb-0 md:mr-4 group-hover:scale-[1.02] transition-transform duration-300">
          <img
            src={episode.still_path ? `${baseImgUrl}${episode.still_path}` : noImg}
            alt={episode.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 text-left pb-2 border-b border-gray-600/50 md:border-none">
          <div className="flex items-center justify-start gap-2 mb-2">
            <div className=" text-primary-2 font-bold text-lg ">{episode.episode_number}</div>
            <h3 className="text-white font-semibold text-lg truncate group-hover:text-primary-2 transition-colors duration-200">
              {episode.name}
            </h3>
          </div>

          <div className="flex items-center justify-start gap-4 text-sm text-gray-400 mb-2">
            <span>{formatDate(episode.air_date)}</span>

            {episode.runtime && <span>{formatRuntime(episode.runtime)}</span>}

            {episode.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className={getVoteColor(episode.vote_average)}>
                  {episode.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Episode stats preview */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {episode.guest_stars?.length > 0 && (
              <span>{episode.guest_stars.length} Guest Stars</span>
            )}
            {episode.crew?.length > 0 && <span>{episode.crew.length} Crew</span>}
          </div>
        </div>

        <div className="flex justify-center items-center text-white text-sm md:hidden mt-3">
          <div className="flex items-center gap-2 px-3 py-2  hover:bg-gray-600/50 transition-colors duration-200">
            <span className="text-gray-300 font-medium">{isExpanded ? "Collapse" : "Expand"}</span>
            <div className="w-4 h-4 text-primary-2 flex items-center justify-center transition-transform duration-200">
              {isExpanded ? (
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 transform rotate-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 transform rotate-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Desktop arrow */}
        <div className="hidden flex-shrink-0 mt-4 md:mt-0 md:ml-4 md:flex justify-center md:justify-start">
          <div className="w-8 h-8 bg-gray-700/50 rounded-full border border-gray-600/30 text-gray-400 flex items-center justify-center hover:bg-primary-2/20 hover:text-primary-2 hover:border-primary-2/30 transition-all duration-200">
            {isExpanded ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
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

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-600/30 animate-in slide-in-from-top-2 duration-300">
          {/* Episode Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-2">{episode.episode_number}</div>
              <div className="text-xs text-gray-400">Episode</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {episode.vote_average ? episode.vote_average.toFixed(1) : "N/A"}
              </div>
              <div className="text-xs text-gray-400">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{episode.runtime || "N/A"}</div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {episode.guest_stars?.length || 0}
              </div>
              <div className="text-xs text-gray-400">Guests</div>
            </div>
          </div>

          {/* Episode Overview */}
          {episode.overview && (
            <div className="mb-6">
              <h4 className="text-white font-semibold text-lg mb-3">Overview</h4>
              <div className="bg-gray-700/20 p-4 rounded-lg border border-gray-600/20">
                <p className="text-gray-300 leading-relaxed">{episode.overview}</p>
              </div>
            </div>
          )}

          {/* Production Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Crew Section */}
            {episode.crew && episode.crew.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold text-lg">Crew</h4>
                  <span className="text-primary-2 text-sm bg-primary-2/20 px-2 py-1 rounded-full">
                    {episode.crew.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-100 overflow-y-auto">
                  {/* All Crew Members */}
                  {episode.crew.slice(0, 8).map((crewMember, index) => (
                    <div
                      key={`crew-${index}`}
                      className="flex items-center gap-3 p-3 bg-gray-700/20 rounded-lg border border-gray-600/20 hover:bg-gray-700/30 hover:border-primary-2/30 transition-all duration-200 cursor-pointer"
                      onClick={(e) => handlePersonClick(crewMember.id, e)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {crewMember.profile_path ? (
                          <img
                            src={`${baseImgUrl}${crewMember.profile_path}`}
                            alt={crewMember.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate hover:text-primary-2 transition-colors duration-200">
                          {crewMember.name}
                        </p>
                        <p className="text-gray-400 text-sm">{crewMember.job}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guest Stars Section */}
            {episode.guest_stars && episode.guest_stars.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold text-lg">Guest Stars</h4>
                  <span className="text-primary-2 text-sm bg-primary-2/20 px-2 py-1 rounded-full">
                    {episode.guest_stars.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-100 overflow-y-auto">
                  {episode.guest_stars.map((star, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-700/20 rounded-lg border border-gray-600/20 hover:bg-gray-700/30 hover:border-primary-2/30 transition-all duration-200 cursor-pointer"
                      onClick={(e) => handlePersonClick(star.id, e)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {star.profile_path ? (
                          <img
                            src={`${baseImgUrl}${star.profile_path}`}
                            alt={star.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate hover:text-primary-2 transition-colors duration-200">
                          {star.name}
                        </p>
                        <p className="text-gray-400 text-sm truncate">{star.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
