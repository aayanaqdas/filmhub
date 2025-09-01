import { useNavigate } from "react-router-dom";
import StarRating from "../StarRating";

export default function Cards({ id, title, mediaType, posterPath, voteAverage }) {
  const navigate = useNavigate();
  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const maxLength = 25;
  const truncatedTitle = title.length > maxLength ? title.substring(0, maxLength) + "..." : title;

  const handleCardClick = () => {
    const path = `/${mediaType}/${id}`;
    navigate(path);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-32 h-48 sm:w-36 sm:h-54 md:w-40 md:h-60 lg:w-48 lg:h-72 xl:w-52 xl:h-78 2xl:w-56 2xl:h-84 pb-4 rounded-md cursor-pointer flex-shrink-0 relative overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `url(${baseImgUrl + posterPath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {mediaType === "tv" && (
        <span className="absolute right-0 m-2 px-2 py-1 rounded-md text-primary-2 text-xs lg:text-sm bg-black/30">
          TV
        </span>
      )}
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      <div className="relative w-full h-full py-0.5 px-2 sm:px-3 md:px-4 flex flex-col justify-end">
        <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold leading-tight drop-shadow-lg">
          {truncatedTitle}
        </h3>

        <div className="scale-75 sm:scale-90 md:scale-100 lg:scale-110 xl:scale-125 origin-left">
          <StarRating voteAverage={voteAverage} />
        </div>
      </div>
    </div>
  );
}
