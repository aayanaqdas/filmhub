import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import HeroSlide from "./HeroCarousel/HeroSlide";
import NavigationButton from "./HeroCarousel/NavigationButton";
import DotsIndicator from "./HeroCarousel/DotsIndicator";

export default function HeroCarousel() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-NO&page=1`;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setHeroData(data.results.slice(0, 4));
        console.log(data)
      } catch (err) {
        setError(err.message);
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(heroData)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  // No data state
  if (!heroData.length) {
    return (
      <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Content not available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
      <div className="h-full px-[1%]">
        <div className="overflow-visible h-full" ref={emblaRef}>
          <div className="flex h-full">
            {heroData.map((item, index) => (
              <HeroSlide key={item.id} item={item} isActive={index === selectedIndex} TMDB_API_KEY={TMDB_API_KEY} />
            ))}
          </div>
        </div>
      </div>

      <NavigationButton direction="prev" onClick={scrollPrev} />
      <NavigationButton direction="next" onClick={scrollNext} />
      <DotsIndicator items={heroData} selectedIndex={selectedIndex} onDotClick={scrollTo} />
    </div>
  );
}
