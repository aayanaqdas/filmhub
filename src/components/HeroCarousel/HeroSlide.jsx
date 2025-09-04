import { useNavigate } from "react-router-dom";
import { movieGenres, tvGenres } from "../../genres";

export default function HeroSlide({ item, isActive }) {
  const navigate = useNavigate();
  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const backDropUrl = baseImgUrl + item.backdrop_path;

  const releaseYear =
    item.media_type === "movie"
      ? item.release_date?.slice(0, 4) || "N/A"
      : item.first_air_date?.slice(0, 4) || "N/A";

  const genreNames = item.genre_ids
    .map((genreId) => {
      const genre =
        item.media_type === "movie"
          ? movieGenres.find((genre) => genre.id === genreId)
          : tvGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  // Check for watch providers in order of preference: flatrate, buy, rent
  const getWatchProvider = () => {
    if (item.providers?.flatrate?.[0]) {
      return {
        name: item.providers.flatrate[0].provider_name,
        logo: item.providers.flatrate[0].logo_path,
        type: "stream",
      };
    }

    if (item.providers?.buy?.[0]) {
      return {
        name: item.providers.buy[0].provider_name,
        logo: item.providers.buy[0].logo_path,
        type: "buy",
      };
    }

    if (item.providers?.rent?.[0]) {
      return {
        name: item.providers.rent[0].provider_name,
        logo: item.providers.rent[0].logo_path,
        type: "rent",
      };
    }

    return null;
  };

  const watchProvider = getWatchProvider();

  const handleSlideClick = () => {
    const path = `/${item.media_type}/${item.id}`;
    navigate(path);
  };

  const getProviderText = (provider) => {
    switch (provider.type) {
      case "stream":
        return `Watch on ${provider.name}`;
      case "buy":
        return `Buy on ${provider.name}`;
      case "rent":
        return `Rent on ${provider.name}`;
      default:
        return `Available on ${provider.name}`;
    }
  };

  return (
    <div
      onClick={handleSlideClick}
      className="relative flex-shrink-0 h-full rounded-md overflow-hidden mr-[1%] cursor-pointer hover:shadow-[inset_0_0_0_2px_rgba(255,255,255,1)]"
      style={{
        flex: "0 0 95%",
        backgroundImage: `url(${backDropUrl})`,
        backgroundPosition: "center top 30%",
        backgroundSize: "cover",
      }}
    >
      {/* Gradients */}
      <div
        className={`hidden md:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`md:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Desktop Layout*/}
      <div
        className={`hidden md:flex relative z-10 items-center h-full px-12 lg:px-16 transition-all duration-700 ${
          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}
      >
        <div className="max-w-2xl text-white">
          {/* Watch Provider or New Release Badge */}
          <div className="mb-4">
            {watchProvider ? (
              <div className="inline-flex items-center bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                {watchProvider.logo && (
                  <img
                    src={`${baseImgUrl}${watchProvider.logo}`}
                    alt={watchProvider.name}
                    className="w-6 h-6 mr-2 rounded"
                  />
                )}
                <span className="text-white text-sm font-medium">
                  {getProviderText(watchProvider)}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Trending right now
              </span>
            )}
          </div>

          {item.logoPath ? (
            <img
              src={`${baseImgUrl}${item.logoPath}`}
              alt={item.title || item.name}
              className="h-16 md:h-20 lg:h-24 xl:h-32 mb-6 object-contain"
            />
          ) : (
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              {item.title || item.name}
            </h1>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-gray-800/80 px-3 py-1 rounded-xl text-sm font-medium">
              {item.certification}
            </span>
            <span className="text-gray-300 text-sm">
              {releaseYear} • {genreNames}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className={`md:hidden relative z-10 flex flex-col justify-end items-center h-full pb-20 px-4 transition-all duration-700 ${
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-white text-center">
          {/* Mobile Watch Provider or New Release Badge */}
          <div className="mb-3">
            {watchProvider ? (
              <div className="inline-flex items-center bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                {watchProvider.logo && (
                  <img
                    src={`${baseImgUrl}${watchProvider.logo}`}
                    alt={watchProvider.name}
                    className="w-4 h-4 mr-1.5 rounded"
                  />
                )}
                <span className="text-white text-xs font-medium">
                  {getProviderText(watchProvider)}
                </span>
              </div>
            ) : (
              <span className="inline-flex text-xs items-center bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                Trending right now
              </span>
            )}
          </div>

          {item.logoPath ? (
            <img
              src={`${baseImgUrl}${item.logoPath}`}
              alt={item.title || item.name}
              className="h-20 object-contain mx-auto mb-4"
            />
          ) : (
            <h1 className="text-xl font-bold mb-4">{item.title || item.name}</h1>
          )}

          <div className="flex flex-wrap items-center justify-center space-x-2 mb-3 text-xs">
            <span className="bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
              {item.certification}
            </span>
            <span className="text-white">{releaseYear}</span>
            <span className="text-white">•</span>
            <span className="text-white text-center">{genreNames}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
