import { useNavigate } from "react-router-dom";
import StarRating from "../StarRating";

export default function SearchCard({ id, title, mediaType, posterPath, voteAverage, overview, releaseDate, firstAirDate }) {
  const navigate = useNavigate();
  const baseImgUrl = `https://image.tmdb.org/t/p/w500`;
  const maxOverviewLength = 200;
  const maxTitleLength = 40;
  
  const truncatedTitle = title && title.length > maxTitleLength 
    ? title.substring(0, maxTitleLength) + "..." 
    : title;
  
  const truncatedOverview = overview && overview.length > maxOverviewLength 
    ? overview.substring(0, maxOverviewLength) + "..." 
    : overview;

  const year = releaseDate ? releaseDate.slice(0, 4) : firstAirDate ? firstAirDate.slice(0, 4) : null;

  const handleCardClick = () => {
    const path = `/${mediaType}/${id}`;
    navigate(path);
  };

  // Handle person cards differently
  if (mediaType === "person") {
    return (
      <div
        className="flex items-center bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-700/50 hover:border-primary-2/50"
        onClick={handleCardClick}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-gray-600">
          <img 
            src={posterPath ? baseImgUrl + posterPath : '/default-person.jpg'} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="ml-4 flex-1">
          <h3 className="text-white text-lg font-semibold mb-1">
            {truncatedTitle}
          </h3>
          <p className="text-primary-2 text-sm opacity-80">
            Person
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-700/50 hover:border-primary-2/50"
      onClick={handleCardClick}
    >
      {/* Poster */}
      <div className="w-20 h-30 sm:w-24 sm:h-36 md:w-28 md:h-42 flex-shrink-0 rounded-md overflow-hidden shadow-lg">
        <img 
          src={posterPath ? baseImgUrl + posterPath : '/default-poster.jpg'} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Content */}
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-lg md:text-xl font-bold leading-tight mb-1">
              {truncatedTitle}
            </h3>
            <div className="flex items-center gap-3 mb-2">
              {year && (
                <span className="text-primary-2 text-sm font-medium">
                  {year}
                </span>
              )}
              {mediaType === "tv" && (
                <span className="px-2 py-1 bg-primary-2/20 text-primary-2 text-xs rounded-full">
                  TV Series
                </span>
              )}
              {mediaType === "movie" && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  Movie
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        {voteAverage > 0 && (
          <div className="mb-3 scale-90 origin-left">
            <StarRating voteAverage={voteAverage} />
          </div>
        )}

        {/* Overview */}
        {overview && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {truncatedOverview}
          </p>
        )}
      </div>
    </div>
  );
}