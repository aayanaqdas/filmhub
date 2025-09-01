import StarRating from "../StarRating";

export default function HeroSection({ data, mediaType }) {
  // if any essential data is missing, don't render
  if (!data || !data.backdrop_path || !data.vote_average) {
    return (
      <div className="w-full h-[70vh] bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }
  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const backDropUrl = baseImgUrl + data.backdrop_path;

  const title = data.title || data.name;
  const releaseDate = data.release_date || data.first_air_date;
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : "N/A";

  const runtimeHour = data.runtime > 60 ? Math.floor(data.runtime / 60) : 0;
  const runtimeMinute = data.runtime > 60 ? data.runtime % 60 : data.runtime;
  const formatRuntime = runtimeHour > 0 ? `${runtimeHour}h ${runtimeMinute}m` : `${runtimeMinute}m`;

  const runtime = mediaType === "tv" ? `${data.seasons.length} Seasons` : formatRuntime;

  const genreNames = data.genres?.map((genre) => genre.name).join(", ") || "N/A";

  const voteCountString = data.vote_count.toString();
  const voteCount =
    voteCountString.length > 3 ? (data.vote_count / 1000).toFixed(1) + "k" : voteCountString;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block relative h-[70vh] w-full overflow-hidden">
        <img
          src={backDropUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ objectPosition: "center top 30%" }}
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent"></div>

        <div className="relative z-10 flex items-center h-full px-12 lg:px-16">
          <div className="max-w-2xl text-white">
            {data.logoPath ? (
              <img
                src={`${baseImgUrl}${data.logoPath}`}
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
                {data.certification || "NR"}
              </span>
              <span className="text-white text-md">
                {releaseYear} • {runtime} • {genreNames}
              </span>
            </div>

            <span className="flex gap-1 text-primary-2 text-sm mb-6">
              <StarRating voteAverage={data.vote_average} />({voteCount})
            </span>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2 cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Now</span>
              </button>

              <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30 cursor-pointer">
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Backdrop  */}
        <div className="relative w-full overflow-hidden bg-black">
          <img src={backDropUrl} alt={title} className="w-full h-full object-contain" />

          {/* Mobile backdrop gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent"></div>

          {/* Mobile content overlay on backdrop */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end items-start px-6">
            <div className="text-white max-w-xs">
              {data.logoPath ? (
                <img
                  src={`${baseImgUrl}${data.logoPath}`}
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
            {data.certification || "NR"}
          </span>
          <span className="text-white">{releaseYear}</span>
          <span className="text-white">•</span>
          <span className="text-white">{runtime}</span>
        </div>

        <div className="flex items-center gap-1 text-primary-2 px-6 text-sm">
          <StarRating voteAverage={data.vote_average} />({voteCount})
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col items-center gap-5 p-6">
          <button className="bg-primary text-white flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 space-x-2 cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Watch Now</span>
          </button>

          <button className="bg-white/20 text-white w-full px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30 cursor-pointer">
            Trailer
          </button>
        </div>
      </div>
    </>
  );
}
