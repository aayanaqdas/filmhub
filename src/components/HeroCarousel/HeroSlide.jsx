import { useState, useEffect } from "react";
import { movieGenres } from "../../genres";

export default function HeroSlide({ item, isActive, TMDB_API_KEY }) {
  const [logoPath, setLogoPath] = useState(null);
  const [ageRating, setAgeRating] = useState("NR"); //Not Rated (NR)

  const logoUrl = `https://api.themoviedb.org/3/movie/${item.id}/images?api_key=${TMDB_API_KEY}`;
  const releaseDatesUrl = `https://api.themoviedb.org/3/movie/${item.id}/release_dates?api_key=${TMDB_API_KEY}`;

  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  const backDropUrl = baseImgUrl + item.backdrop_path;

  const releaseYear = item.release_date.slice(0, 4) || "N/A";
  const genreNames = item.genre_ids
    .map((genreId) => {
      const genre = movieGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(logoUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch logos");
        }
        const data = await response.json();

        const englishLogos = data.logos.filter((logo) => logo.iso_639_1 === "en");

        if (englishLogos.length > 0) {
          setLogoPath(englishLogos[0].file_path);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLogos();
  }, [logoUrl]);

  useEffect(() => {
    const fetchAgeRating = async () => {
      try {
        const response = await fetch(releaseDatesUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch release dates");
        }

        const data = await response.json();

        // Look for US certification first
        const usRelease = data.results.find((result) => result.iso_3166_1 === "US");
        if (usRelease && usRelease.release_dates.length > 0) {
          const certification = usRelease.release_dates[0].certification;
          if (certification) {
            setAgeRating(certification);
            return;
          }
        }

        // Fallback to any other country with certification
        for (const result of data.results) {
          if (result.release_dates.length > 0) {
            const certification = result.release_dates[0].certification;
            if (certification) {
              setAgeRating(certification);
              return;
            }
          }
        }
      } catch (err) {
        console.log("Failed to fetch age rating:", err);
      }
    };

    fetchAgeRating();
  }, [releaseDatesUrl]);

  return (
    <div
      className="relative flex-shrink-0 h-full rounded-md overflow-hidden mr-[1%] "
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
          {/* Status Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-primary-2 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 "></span>
              NEW RELEASE
            </span>
          </div>

          {logoPath ? (
            <img
              src={`${baseImgUrl}${logoPath}`}
              alt={item.title}
              className="h-16 md:h-20 lg:h-24 xl:h-32 mb-6 object-contain"
            />
          ) : (
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              {item.title}
            </h1>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-gray-800/80 px-3 py-1 rounded-xl text-sm font-medium">
              {ageRating}
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
          {/* Mobile Status Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-primary-2 shadow-lg">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
              NEW RELEASE
            </span>
          </div>

          {logoPath ? (
            <img
              src={`${baseImgUrl}${logoPath}`}
              alt={item.title}
              className="h-20 object-contain mx-auto mb-4"
            />
          ) : (
            <h1 className="text-xl font-bold mb-4">{item.title}</h1>
          )}

          <div className="flex items-center justify-center space-x-2 mb-3 text-xs">
            <span className="bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
              {ageRating}
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
