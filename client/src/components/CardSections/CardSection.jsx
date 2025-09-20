import Cards from "./Cards";
import NavigationButton from "../NavigationButton";
import { useRef } from "react";

export default function CardSection({
  sectionTitle,
  data,
  mediaType,
  timeWindow,
  hasFilterButton,
  onTimeWindowChange,
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

  // Don't render if no data
  if (!data || data.length === 0) {
    return null;
  }

  if (mediaType === "season") {
    const seasonCards = data?.map((season) => {
      return (
        <Cards
          key={season.id}
          id={season.id}
          mediaType={"season"}
          posterPath={season.poster_path}
          title={season.name}
          epCount={season.episode_count}
        />
      );
    });

    return (
      <section className="w-full pt-5 relative">
        <h1 className="text-primary-2 text-2xl md:text-3xl font-bold mb-4 px-7">{sectionTitle}</h1>

        <div className="relative">
          <NavigationButton direction="prev" onClick={scrollLeft} variant="section" />
          <NavigationButton direction="next" onClick={scrollRight} variant="section" />

          <div
            ref={scrollContainerRef}
            className="w-full flex gap-4 overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar px-7 scroll-smooth"
          >
            {seasonCards}
          </div>
        </div>
      </section>
    );
  }

  // Render person cards (for cast members)
  if (mediaType === "person") {
    const personCards = data?.map((person) => {
      return (
        <Cards
          key={person.id}
          id={person.id}
          mediaType={"person"}
          posterPath={person.profile_path}
          title={person.name}
          character={person.character}
        />
      );
    });

    return (
      <section className="w-full pt-5 relative">
        <h1 className="text-primary-2 text-2xl md:text-3xl font-bold mb-4 px-7">{sectionTitle}</h1>

        <div className="relative">
          <NavigationButton direction="prev" onClick={scrollLeft} variant="section" />
          <NavigationButton direction="next" onClick={scrollRight} variant="section" />

          <div
            ref={scrollContainerRef}
            className="w-full flex gap-4 overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar px-7 scroll-smooth"
          >
            {personCards}
          </div>
        </div>
      </section>
    );
  }

  // Render movie/TV cards
  const cards = data?.map((media) => {
    return (
      <Cards
        key={media.id}
        id={media.id}
        mediaType={mediaType === "all" ? media.media_type : mediaType}
        posterPath={media.poster_path}
        title={media.title ? media.title : media.name}
        voteAverage={media.vote_average}
      />
    );
  });

  return (
    <section className="w-full pt-5 relative">
      <div className="flex items-center gap-5 px-7 mb-4">
        <h1 className="text-primary-2 text-2xl md:text-3xl font-bold">{sectionTitle}</h1>
        {hasFilterButton && (
          <div className="flex border-1 border-primary-2 rounded-full p-1">
            <button
              onClick={() => onTimeWindowChange("day")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                timeWindow === "day"
                  ? "bg-primary-2 text-black"
                  : "text-primary-2 hover:bg-primary-2/10"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onTimeWindowChange("week")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                timeWindow === "week"
                  ? "bg-primary-2 text-black"
                  : "text-primary-2 hover:bg-primary-2/10"
              }`}
            >
              This Week
            </button>
          </div>
        )}
      </div>

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
    </section>
  );
}
