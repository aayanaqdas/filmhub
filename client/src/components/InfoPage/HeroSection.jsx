import StarRating from "../StarRating";
import noImg from "../../assets/no_image.svg";

export default function HeroSection({ data, mediaType, onWatchNowClick, openVideoModal }) {
  if (!data) {
    return (
      <div className="w-full h-[70vh] bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  const userRegion = localStorage.getItem("region") || "US";

  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const backDropUrl = data.backdrop_path ? baseImgUrl + data.backdrop_path : noImg;
  const title = data.title || data.name || "Unknown Title";
  const releaseDate = data.release_date || data.first_air_date;
  let releaseYear = releaseDate ? releaseDate.slice(0, 4) : "N/A";

  const runtimeHour = data.runtime && data.runtime > 60 ? Math.floor(data.runtime / 60) : 0;
  const runtimeMinute = data.runtime && data.runtime > 60 ? data.runtime % 60 : data.runtime || 0;
  const formatRuntime = runtimeHour > 0 ? `${runtimeHour}h ${runtimeMinute}m` : `${runtimeMinute}m`;

  const runtime =
    mediaType === "tv" && data.seasons
      ? `${data.seasons.length} Season${data.seasons.length > 1 ? "s" : ""}`
      : formatRuntime;

  const genreNames = data.genres?.map((genre) => genre.name).join(", ") || "N/A";

  const voteCountString = data.vote_count ? data.vote_count.toString() : "0";
  const voteCount =
    voteCountString.length > 3 ? (data.vote_count / 1000).toFixed(1) + "k" : voteCountString;

  // Process logo
  const englishLogos = data.images?.logos?.filter((logo) => logo.iso_639_1 === "en") || [];
  const logoPath = englishLogos.length > 0 ? englishLogos[0].file_path : null;

  let certification = "NR";

  if (mediaType === "movie") {
    const release = data.release_dates?.results?.find((result) => result.iso_3166_1 === userRegion);

    if (release && release.release_dates.length > 0) {
      certification = release.release_dates[0].certification || "NR";

      // release year based on user region
      const releaseDate = release.release_dates[0].release_date;
      releaseYear = releaseDate ? releaseDate.slice(0, 4) : "N/A";
    } else {
      // Fallback to any other country with certification
      for (const result of data.release_dates?.results || []) {
        if (result.release_dates.length > 0 && result.release_dates[0].certification) {
          certification = result.release_dates[0].certification;
          break;
        }
      }
    }
  } else {
    // rating is a age certification for TV series
    const rating = data.content_ratings?.results?.find(
      (result) => result.iso_3166_1 === userRegion
    );

    if (rating && rating.rating) {
      certification = rating.rating;
    } else {
      // Fallback to any other country with rating
      for (const result of data.content_ratings?.results || []) {
        if (result.rating) {
          certification = result.rating;
          break;
        }
      }
    }
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block relative h-[70vh] w-full overflow-hidden">
        {/* Backdrop image */}
        <div className="absolute right-0 top-0 h-full w-[90%]">
          <img
            src={backDropUrl}
            alt={title}
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: "center 30%" }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center h-full max-w-[1440px] mx-auto px-6 ">
          <div className="max-w-2xl text-white">
            {logoPath ? (
              <img
                src={`${baseImgUrl}${logoPath}`}
                alt={title}
                className="h-16 md:h-20 lg:h-24 xl:h-32 mb-6 object-contain"
              />
            ) : (
              <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                {title}
              </h1>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-gray-800/80 px-3 py-1 rounded-xl text-sm font-medium">
                {certification || "NR"}
              </span>
              <span className="text-white text-md">
                {releaseYear} • {runtime} • {genreNames}
              </span>
            </div>

            {data.vote_average !== undefined && (
              <span className="flex gap-1 text-primary-2 text-sm mb-6">
                <StarRating voteAverage={data.vote_average} />({voteCount})
              </span>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onWatchNowClick}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Now</span>
              </button>

              <button
                onClick={openVideoModal}
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30 cursor-pointer"
              >
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        {/* Mobile Backdrop  */}
        <div className="relative w-full overflow-hidden bg-black">
          <img src={backDropUrl} alt={title} className="w-full h-full object-contain" />

          {/* Mobile backdrop gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent"></div>

          {/* Mobile content overlay on backdrop */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end items-start px-6">
            <div className="text-white max-w-xs">
              {logoPath ? (
                <img
                  src={`${baseImgUrl}${logoPath}`}
                  alt={title}
                  className="h-12 object-contain mb-4"
                />
              ) : (
                <h1 className="text-xl font-bold mb-4 text-left">{title}</h1>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-6 mb-3 text-sm text-white">
          <span className="bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
            {certification || "NR"}
          </span>
          <span className="text-white">{releaseYear}</span>
          <span className="text-white">•</span>
          <span className="text-white">{runtime}</span>
        </div>

        {data.vote_average !== undefined && (
          <div className="flex items-center gap-1 text-primary-2 px-6 text-sm">
            <StarRating voteAverage={data.vote_average} />({voteCount})
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col items-center gap-5 p-6">
          <button
            onClick={onWatchNowClick}
            className="bg-primary text-white flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 space-x-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Watch Now</span>
          </button>

          <button
            onClick={openVideoModal}
            className="bg-white/20 text-white w-full px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30 cursor-pointer"
          >
            Trailer
          </button>
        </div>
      </div>
    </>
  );
}
