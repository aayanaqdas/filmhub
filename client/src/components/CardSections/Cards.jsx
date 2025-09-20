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
}) {
  const navigate = useNavigate();
  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const maxLength = 25;
  const truncatedTitle = title?.length > maxLength ? title?.substring(0, maxLength) + "..." : title;
  const handleCardClick = () => {
    const path = `/${mediaType}/${id}`;
    navigate(path);
  };

  if (mediaType === "season") {
    return (
      <div
        className="flex items-start min-w-70 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-2/20 border border-gray-600/30 hover:border-primary-2/60 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border border-gray-600/50">
          <img
            src={posterPath ? `${baseImgUrl}${posterPath}` : noImg}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="ml-4 flex-1 py-4">
          <h3 className="text-white text-lg md:text-xl font-bold leading-tight mb-3 drop-shadow-lg">
            {truncatedTitle}
          </h3>
          <div className="inline-flex items-center px-3 py-1 bg-gray-700/50 rounded-full border border-gray-600/50">
            <span className="text-primary-2 text-sm font-semibold">
              {epCount > 0 ? epCount : "TBA"}
            </span>
            <span className="text-gray-300 text-xs ml-1">episodes</span>
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
      />

      {mediaType === "tv" && (
        <span className="absolute right-0 m-2 px-2 py-1 rounded-md text-primary-2 text-xs lg:text-sm bg-black/30 z-10">
          TV
        </span>
      )}
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-5"></div>

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
