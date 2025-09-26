import { useState } from "react";
import MediaGallery from "../CardSections/MediaGallerySection";

export default function MediaGalleryFilters({ images, videos, onImageClick, onVideoClick }) {
  const [selectedImageType, setSelectedImageType] = useState("all");
  const [selectedVideoType, setSelectedVideoType] = useState("all");

  // Combine and filter images based on selection
  const getFilteredImages = () => {
    const allImages = [];

    if (images?.backdrops?.length > 0) {
      allImages.push(...images.backdrops.map((img) => ({ ...img, imageType: "backdrop" })));
    }
    if (images?.posters?.length > 0) {
      allImages.push(...images.posters.map((img) => ({ ...img, imageType: "poster" })));
    }
    if (images?.logos?.length > 0) {
      allImages.push(...images.logos.map((img) => ({ ...img, imageType: "logo" })));
    }

    // For person info page
    if (images?.profiles?.length > 0) {
      allImages.push(...images.profiles.map((img) => ({ ...img, imageType: "profiles" })));
    }

    // Sort by vote_average first, then by resolution
    const sortedImages = allImages.sort((a, b) => {
      if (a.vote_average && b.vote_average && a.vote_average !== b.vote_average) {
        return b.vote_average - a.vote_average;
      }
      return b.width * b.height - a.width * a.height;
    });

    // Filter based on selection
    if (selectedImageType === "all") {
      return sortedImages;
    }
    return sortedImages.filter((img) => img.imageType === selectedImageType);
  };

  const getFilteredVideos = () => {
    if (!videos?.results) return [];

    const allVideos = videos.results.map((video) => ({ ...video, videoType: video.type }));

    // Sort by popularity/type priority first, then by published date
    const sortedVideos = allVideos.sort((a, b) => {
      // Priority order for video types
      const typeOrder = {
        Trailer: 0,
        Teaser: 1,
        Clip: 2,
        Featurette: 3,
        "Behind the Scenes": 4,
        Bloopers: 5,
      };

      const aOrder = typeOrder[a.type] ?? 999;
      const bOrder = typeOrder[b.type] ?? 999;

      // First sort by type priority
      if (aOrder !== bOrder) return aOrder - bOrder;

      // Then by published date (newer first)
      return new Date(b.published_at || 0) - new Date(a.published_at || 0);
    });

    // Filter based on selection
    if (selectedVideoType === "all") {
      return sortedVideos;
    }
    return sortedVideos.filter(
      (video) => video.type.toLowerCase() === selectedVideoType.toLowerCase()
    );
  };

  const filteredImages = getFilteredImages();
  const filteredVideos = getFilteredVideos();
  const hasImages = filteredImages.length > 0;
  const hasVideos = filteredVideos.length > 0;

  // Get counts for each type
  const imageCounts = {
    all:
      (images?.backdrops?.length || 0) +
      (images?.posters?.length || 0) +
      (images?.logos?.length || 0) +
      (images?.profiles?.length || 0),
    backdrop: images?.backdrops?.length || 0,
    poster: images?.posters?.length || 0,
    logo: images?.logos?.length || 0,
    profiles: images?.profiles?.length || 0,
  };

  const videoCounts = {
    all: videos?.results?.length || 0,
    trailer: videos?.results?.filter((v) => v.type === "Trailer").length || 0,
    teaser: videos?.results?.filter((v) => v.type === "Teaser").length || 0,
    clip: videos?.results?.filter((v) => v.type === "Clip").length || 0,
    featurette: videos?.results?.filter((v) => v.type === "Featurette").length || 0,
    "behind the scenes": videos?.results?.filter((v) => v.type === "Behind the Scenes").length || 0,
    bloopers: videos?.results?.filter((v) => v.type === "Bloopers").length || 0,
  };

  return (
    <>
      {/* Images Section with Filter */}
      {hasImages && (
        <section className="w-full pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-7">
            <h1 className="text-primary-2 text-2xl md:text-3xl font-bold">Images</h1>

            {/* Image Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Filter:</span>
              <select
                value={selectedImageType}
                onChange={(e) => setSelectedImageType(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-2 transition-colors cursor-pointer"
              >
                <option value="all">All Images ({imageCounts.all})</option>
                {imageCounts.backdrop > 0 && (
                  <option value="backdrop">Backdrops ({imageCounts.backdrop})</option>
                )}
                {imageCounts.poster > 0 && (
                  <option value="poster">Posters ({imageCounts.poster})</option>
                )}
                {imageCounts.logo > 0 && <option value="logo">Logos ({imageCounts.logo})</option>}
              </select>
            </div>
          </div>

          <MediaGallery
            data={filteredImages}
            type="images"
            onItemClick={onImageClick}
            initialDisplayCount={8}
            loadMoreCount={8}
          />
        </section>
      )}

      {hasVideos && (
        <section className="w-full pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-7">
            <h1 className="text-primary-2 text-2xl md:text-3xl font-bold">Videos</h1>

            {/* Image Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Filter:</span>
              <select
                value={selectedVideoType}
                onChange={(e) => setSelectedVideoType(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-2 transition-colors cursor-pointer"
              >
                <option value="all">All Videos ({videoCounts.all})</option>
                {videoCounts.trailer > 0 && (
                  <option value="trailer">Trailers ({videoCounts.trailer})</option>
                )}
                {videoCounts.teaser > 0 && (
                  <option value="teaser">Teasers ({videoCounts.teaser})</option>
                )}
                {videoCounts.clip > 0 && <option value="clip">Clips ({videoCounts.clip})</option>}
                {videoCounts.featurette > 0 && (
                  <option value="featurette">Featurettes ({videoCounts.featurette})</option>
                )}
                {videoCounts["behind the scenes"] > 0 && (
                  <option value="behind the scenes">
                    Behind the Scenes ({videoCounts["behind the scenes"]})
                  </option>
                )}
                {videoCounts.bloopers > 0 && (
                  <option value="bloopers">Bloopers ({videoCounts.bloopers})</option>
                )}
              </select>
            </div>
          </div>

          <MediaGallery
            data={filteredVideos}
            type="videos"
            onItemClick={onVideoClick}
            initialDisplayCount={8}
            loadMoreCount={6}
          />
        </section>
      )}
    </>
  );
}
