import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { heroData } from "../data.js";
import HeroSlide from "./HeroCarousel/HeroSlide";
import NavigationButton from "./HeroCarousel/NavigationButton";
import DotsIndicator from "./HeroCarousel/DotsIndicator";

export default function HeroCarousel() {
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

  return (
    <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
      <div className="h-full px-[1%]">
        <div className="overflow-visible h-full" ref={emblaRef}>
          <div className="flex h-full">
            {heroData.map((item, index) => (
              <HeroSlide key={item.id} item={item} isActive={index === selectedIndex} />
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
