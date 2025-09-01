import StarRating from "../StarRating";

export default function HeroSection({ data, mediaType }) {
  console.log(data);
  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const backDropUrl = baseImgUrl + data.backdrop_path;

  const title = data.title || data.name;
  const releaseDate = data.release_date || data.first_air_date;
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : "N/A";

  const runtimeHour = data.runtime > 60 ? Math.floor(data.runtime / 60) : 0;
  const runtimeMinute = data.runtime > 60 ? data.runtime % 60 : data.runtime;
  const formatRuntime = runtimeHour > 0 ? `${runtimeHour}h ${runtimeMinute}m` : `${runtimeMinute}m`;

  const runtime = mediaType === "tv" ? `Seasons: ${data.seasons.length}` : formatRuntime;

  const genreNames = data.genres?.map((genre) => genre.name).join(", ") || "N/A";

  const voteCountString = data.vote_count.toString();
  const voteCount =
    voteCountString.length > 3 ? (data.vote_count / 1000).toFixed(1) + "k" : voteCountString;

  return (
    <div
      className="relative h-[70vh] w-full overflow-hidden"
      style={{
        backgroundImage: `url(${backDropUrl})`,
        backgroundPosition: "center top 30%",
        backgroundSize: "cover",
      }}
    >
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent"></div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative z-10 items-center h-full px-12 lg:px-16">
        <div className="max-w-2xl text-white">
          {data.logoPath ? (
            <img
              src={`${baseImgUrl}${data.logoPath}`}
              alt={title}
              className="h-16 md:h-20 lg:h-24 xl:h-32 mb-6 object-contain"
            />
          ) : (
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">{title}</h1>
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

      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 flex flex-col justify-end items-center h-full pb-20 px-4">
        <div className="text-white text-center w-full">
          {data.logoPath ? (
            <img
              src={`${baseImgUrl}${data.logoPath}`}
              alt={title}
              className="h-20 object-contain mx-auto mb-4"
            />
          ) : (
            <h1 className="text-xl font-bold mb-4">{title}</h1>
          )}

          <div className="flex items-center justify-center space-x-2 mb-3 text-md">
            <span className="bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
              {data.certification || "NR"}
            </span>
            <span className="text-white">{releaseYear}</span>
            <span className="text-white">•</span>
            <span className="text-white">{runtime}</span>
          </div>

          <div className="flex items-center justify-center gap-1 text-primary-2 text-sm mb-6">
            <StarRating voteAverage={data.vote_average} />({voteCount})
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col space-y-4 w-full max-w-sm mx-auto">
            <button className="bg-primary text-white w-full py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Watch Now</span>
            </button>

            <button className="bg-white/20 text-white w-full py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30 cursor-pointer">
              Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
