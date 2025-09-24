import { useState, useMemo } from "react";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
import NavigationButton from "../NavigationButton";
import { useRef } from "react";

export default function MediaGallery({
  data,
  type,
  onItemClick,
  initialDisplayCount = 12,
  loadMoreCount = 8,
}) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const scrollContainerRef = useRef(null);

  // Sort and filter data
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // For images: prioritize by vote_average, then by resolution
    if (type === "images") {
      return [...data].sort((a, b) => {
        // First sort by vote_average (if available)
        if (a.vote_average && b.vote_average) {
          if (b.vote_average !== a.vote_average) {
            return b.vote_average - a.vote_average;
          }
        }
        // Then by resolution (area)
        return b.width * b.height - a.width * a.height;
      });
    }

    // For videos: prioritize trailers, then by published date
    return [...data].sort((a, b) => {
      const typeOrder = { Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3 };
      const aOrder = typeOrder[a.type] ?? 999;
      const bOrder = typeOrder[b.type] ?? 999;

      if (aOrder !== bOrder) return aOrder - bOrder;

      return new Date(b.published_at || 0) - new Date(a.published_at || 0);
    });
  }, [data, type]);

  const displayedItems = sortedData.slice(0, displayCount);
  const hasMore = displayCount < sortedData.length;

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + loadMoreCount, sortedData.length));
  };

  if (!data || data.length === 0) return null;

  return (
    <section className="w-full relative">
      {/* Gallery */}
      <div className="relative">
        <NavigationButton direction="prev" onClick={scrollLeft} />
        <NavigationButton direction="next" onClick={scrollRight} />

        <div
          ref={scrollContainerRef}
          className="w-full flex gap-4 overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar px-7 scroll-smooth"
        >
          {displayedItems.map((item, index) =>
            type === "images" ? (
              <ImageCard
                key={`${item.file_path}-${index}`}
                image={item}
                onImageClick={onItemClick}
              />
            ) : (
              <VideoCard key={`${item.key}-${index}`} video={item} onVideoClick={onItemClick} />
            )
          )}

          {/* Load More Card */}
          {hasMore && (
            <div
              className="flex-shrink-0 w-80 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-dashed border-gray-600/50 hover:border-primary-2/50 transition-all duration-300 cursor-pointer flex items-center justify-center"
              onClick={loadMore}
            >
              <div className="text-center p-8">
                <div className="w-12 h-12 bg-primary-2/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-primary-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-primary-2 font-medium text-sm">Load More</p>
                <p className="text-gray-400 text-xs mt-1">
                  +{Math.min(loadMoreCount, sortedData.length - displayCount)} more
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
