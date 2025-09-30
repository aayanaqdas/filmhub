import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import HeroSlide from "./HeroSlide";
import NavigationButton from "../NavigationButton";
import DotsIndicator from "./DotsIndicator";
import { useCarouselData } from "../../hooks/useCarouselData";

export default function HeroCarousel() {
  const { carouselItems, loading, error } = useCarouselData();

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

  // No data state
  if (!carouselItems.length) {
    return (
      <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Content not available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden shadow-2xl">
      <div className="h-full px-[1%]">
        <div className="overflow-visible h-full" ref={emblaRef}>
          <div className="flex h-full">
            {carouselItems.map((item, index) => (
              <HeroSlide key={item.id} item={item} isActive={index === selectedIndex} />
            ))}
          </div>
        </div>
      </div>

      <NavigationButton direction="prev" onClick={scrollPrev} />
      <NavigationButton direction="next" onClick={scrollNext} />
      <DotsIndicator items={carouselItems} selectedIndex={selectedIndex} onDotClick={scrollTo} />
    </div>
  );
}
