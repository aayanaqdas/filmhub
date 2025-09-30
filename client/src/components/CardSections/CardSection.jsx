import Cards from "./Cards";
import VideoCard from "./VideoCard";
import NavigationButton from "../NavigationButton";
import { useRef, useMemo } from "react";

export default function CardSection({
  sectionTitle,
  data,
  mediaId,
  mediaType,
  filters = {},
  hasFilterButton,
  filterKey,
  filterOptions = [],
  filterLabels = {},
  onFilterChange,
  loading = false,
  error = null,
  openVideoModal,
}) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  const cards = useMemo(() => {
    if (!data || data.length === 0) return null;
    if (mediaType === "season") {
      return data.map((season) => (
        <Cards
          key={season.id}
          id={season.id}
          mediaType={"season"}
          posterPath={season.poster_path}
          title={season.name}
          epCount={season.episode_count}
          releaseDate={season.air_date}
          seriesId={mediaId}
          seasonNum={season.season_number}
        />
      ));
    } else if (mediaType === "person") {
      return data.map((person) => (
        <Cards
          key={person.id}
          id={person.id}
          mediaType={"person"}
          posterPath={person.profile_path}
          title={person.name}
          character={person.character}
        />
      ));
    } else if (mediaType === "video") {
      return data.map((video, index) => (
        <VideoCard
          key={`${video.key}-${index}`}
          video={video}
          onVideoClick={openVideoModal}
          page={"homepage"}
        />
      ));
    } else {
      return data.map((media) => (
        <Cards
          key={media.id}
          id={media.id}
          mediaType={mediaType === "all" ? media.media_type : mediaType}
          posterPath={media.poster_path}
          title={media.title ? media.title : media.name}
          voteAverage={media.vote_average}
        />
      ));
    }
  }, [data, mediaType, mediaId]);

  const content = useMemo(() => {
    if (error) {
      return (
        <div className="px-7">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg text-lg">
            Error: {error}
          </div>
        </div>
      );
    } else if (loading) {
      return (
        <div className="px-7">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-36 h-50 bg-gray-800 rounded animate-pulse flex-shrink-0"
              ></div>
            ))}
          </div>
        </div>
      );
    } else if (!data || data.length === 0) {
      return (
        <div className="px-7">
          <div className="text-white text-lg">No content available</div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <NavigationButton direction="prev" onClick={scrollLeft} variant="section" />
          <NavigationButton direction="next" onClick={scrollRight} variant="section" />

          <div
            ref={scrollContainerRef}
            className="w-full flex gap-4 overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar px-7 scroll-smooth"
          >
            {cards}
          </div>
        </div>
      );
    }
  }, [error, loading, data, cards]);

  return (
    <section className="w-full pt-5 relative">
      <div className="flex items-center gap-5 px-7 mb-4">
        <h1 className="text-primary-2 text-2xl md:text-3xl font-bold">{sectionTitle}</h1>
        {hasFilterButton && filterKey && filterOptions.length > 0 && (
          <>
            {/* Button group for desktop */}
            <div className="hidden md:flex border border-primary-2 rounded-full p-1 bg-black/20">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onFilterChange({ ...filters, [filterKey]: option })}
                  className={`px-2 py-1 rounded-full text-sm font-medium transition-colors duration-300 ease-in-out cursor-pointer ${
                    filters[filterKey] === option
                      ? "bg-primary-2 text-black shadow-md"
                      : "text-primary-2 hover:bg-primary-2/20 hover:shadow-sm"
                  }`}
                >
                  {filterLabels[option] || option}
                </button>
              ))}
            </div>
            {/* Select dropdown for mobile */}
            <select
              className="md:hidden bg-primary-2 text-black rounded-full px-2 py-1 text-sm font-medium border-none outline-none cursor-pointer"
              value={filters[filterKey] || ""}
              onChange={(e) => onFilterChange({ ...filters, [filterKey]: e.target.value })}
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {filterLabels[option] || option}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {content}
    </section>
  );
}
