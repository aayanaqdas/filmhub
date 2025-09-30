import { useNavigate } from "react-router-dom";
import StarRating from "../StarRating";
import noImg from "../../assets/no_image.svg";
import noImgPerson from "../../assets/no_person_img.svg";

export default function Cards({
  id,
  title,
  mediaType,
  posterPath,
  voteAverage,
  character,
  epCount,
  releaseDate,
  seriesId,
  seasonNum,
}) {
  const navigate = useNavigate();
  const baseImgUrl = "https://image.tmdb.org/t/p/w500";

  const maxLength = 25;
  const truncatedTitle = title?.length > maxLength ? title?.substring(0, maxLength) + "..." : title;
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        year: "numeric",
        month: "long",
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(releaseDate);

  const handleCardClick = () => {
    if (mediaType === "season") {
      navigate(`/tv/${seriesId}/season/${seasonNum}`);
    } else {
      navigate(`/${mediaType}/${id}`);
    }
  };
  if (mediaType === "season") {
    return (
      <div
        className="group flex items-start min-w-76 md:min-w-100 bg-gray-800/50 hover:text-gray-700/50 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary-2/30 border border-gray-600/40 hover:border-primary-2/70 cursor-pointer backdrop-blur-sm"
        onClick={handleCardClick}
      >
        <div className="w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-200">
          <img
            src={posterPath ? `${baseImgUrl}${posterPath}` : noImg}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-4 py-2 flex-1 space-y-3">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-bold leading-tight mb-2 drop-shadow-lg group-hover:text-primary-2 transition-colors duration-300">
              {truncatedTitle}
            </h3>
            {formattedDate ? (
              <p className="text-primary/80 text-sm font-medium">Premiered {formattedDate}</p>
            ) : (
              <p className="text-primary/80 text-sm font-medium">To be announced</p>
            )}
          </div>

          <div className="flex items-center">
            {epCount > 0 && (
              <div className="flex items-center px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-primary-2/20 to-primary/20 rounded-full border border-primary-2/30 group-hover:border-primary-2/60 transition-all duration-300">
                <span className="text-primary-2 text-sm font-bold">
                  {epCount > 0 ? epCount : "TBA"}
                </span>
                <span className="text-gray-300 text-xs ml-2 font-medium">episodes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mediaType === "person") {
    return (
      <div
        className="flex flex-col items-center flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 cursor-pointer "
        onClick={handleCardClick}
      >
        <div className="w-31 h-31 sm:w-35 sm:h-35 md:w-39 md:h-39 lg:w-43 lg:h-43 rounded-full overflow-hidden mb-2 shadow-lg  border-2  hover:border-white transform-border duration-300">
          <img
            src={posterPath ? baseImgUrl + posterPath : noImgPerson}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="text-center">
          <h3 className="text-white text-xs sm:text-sm md:text-base font-semibold leading-tight mb-1">
            {truncatedTitle}
          </h3>
          {character && (
            <p className="text-primary-2 text-xs sm:text-sm opacity-80">
              {character.length > 20 ? character.substring(0, 20) + "..." : character}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="w-32 h-48 sm:w-36 sm:h-54 md:w-40 md:h-60 lg:w-48 lg:h-72 xl:w-52 xl:h-78 2xl:w-56 2xl:h-84 pb-4 rounded-md cursor-pointer flex-shrink-0 relative overflow-hidden shadow-2xl  border-2  hover:border-white transform-border duration-300"
    >
      {/* Background Image */}
      <img
        src={posterPath ? baseImgUrl + posterPath : noImg}
        alt={title}
        className="absolute inset-0 w-full h-full"
        loading={"lazy"}
      />

      {mediaType === "tv" && (
        <span className="absolute right-0 m-2 px-2 py-1 rounded-md text-primary-2 text-xs lg:text-sm bg-black/30 z-10">
          TV
        </span>
      )}
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      <div className="relative w-full h-full py-0.5 px-2 sm:px-3 md:px-4 flex flex-col justify-end z-10">
        <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold leading-tight drop-shadow-lg">
          {truncatedTitle}
        </h3>

        <div className="scale-75 sm:scale-90 md:scale-100 lg:scale-110 xl:scale-125 origin-left">
          <StarRating voteAverage={voteAverage || null} />
        </div>
      </div>
    </div>
  );
}
