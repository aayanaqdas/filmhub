import Cards from "./cards";
import NavigationButton from "../NavigationButton";
import { useRef } from "react";

export default function CardSection({ sectionTitle, data }) {
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

  const cards = data.map((media) => {
    return (
      <Cards
        key={media.id}
        id={media.id}
        mediaType={media.media_type}
        posterPath={media.poster_path}
        title={media.title ? media.title : media.name}
        voteAverage={media.vote_average}
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
          {cards}
        </div>
      </div>
    </section>
  );
}