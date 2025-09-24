import CardSection from "../components/CardSections/CardSection";
import HeroSection from "../components/InfoPage/HeroSection";
import PersonInfo from "../components/InfoPage/PersonInfo";
import SeasonInfoPage from "../components/InfoPage/SeasonInfoPage";
import WatchProviderSection from "../components/InfoPage/WatchProviders";
import VideoModal from "../components/InfoPage/VideoModal";
import ImageModal from "../components/InfoPage/ImageModal";
import MediaGallery from "../components/CardSections/MediaGallery";
import { useInfoPageData } from "../hooks/useInfoPageData";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";

export default function InfoPage() {
  const { mediaType, id, seasonNumber } = useParams();
  const { data, loading, error } = useInfoPageData(mediaType, id, seasonNumber);
  const watchNowRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoType, setSelectedVideoType] = useState("all");

  const userRegion = JSON.parse(localStorage.getItem("region")) || "US";

  if (!data) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
      </div>
    );
  }

  console.log(data);
  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  // Combine and filter images based on selection
  const getFilteredImages = () => {
    const allImages = [];

    if (data.images?.backdrops?.length > 0) {
      allImages.push(...data.images.backdrops.map((img) => ({ ...img, imageType: "backdrop" })));
    }
    if (data.images?.posters?.length > 0) {
      allImages.push(...data.images.posters.map((img) => ({ ...img, imageType: "poster" })));
    }
    if (data.images?.logos?.length > 0) {
      allImages.push(...data.images.logos.map((img) => ({ ...img, imageType: "logo" })));
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
    if (!data.videos?.results) return [];

    const allVideos = data.videos.results.map((video) => ({ ...video, videoType: video.type }));

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
      (data.images?.backdrops?.length || 0) +
      (data.images?.posters?.length || 0) +
      (data.images?.logos?.length || 0),
    backdrop: data.images?.backdrops?.length || 0,
    poster: data.images?.posters?.length || 0,
    logo: data.images?.logos?.length || 0,
  };

  const videoCounts = {
    all: data.videos?.results?.length || 0,
    trailer: data.videos?.results?.filter((v) => v.type === "Trailer").length || 0,
    teaser: data.videos?.results?.filter((v) => v.type === "Teaser").length || 0,
    clip: data.videos?.results?.filter((v) => v.type === "Clip").length || 0,
    featurette: data.videos?.results?.filter((v) => v.type === "Featurette").length || 0,
    "behind the scenes":
      data.videos?.results?.filter((v) => v.type === "Behind the Scenes").length || 0,
    bloopers: data.videos?.results?.filter((v) => v.type === "Bloopers").length || 0,
  };

  const scrollToWatchNow = () => {
    watchNowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (mediaType === "person") {
    return <PersonInfo data={data} loading={loading} error={error} />;
  }

  if (seasonNumber) {
    return <SeasonInfoPage data={data} loading={loading} error={error} />;
  }

  const watchProviders = data["watch/providers"]?.results?.[userRegion] || null;
  const trailer =
    data.videos?.results?.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
    data.videos?.results?.find((video) => video.site === "YouTube"); // Fallback to any YouTube video if no trailer

  return (
    <div className="w-full h-full flex flex-col items-center">
      <HeroSection
        data={data}
        mediaType={mediaType}
        onWatchNowClick={scrollToWatchNow}
        openVideoModal={() => openVideoModal(trailer)}
      />

      {/* Content */}
      <div className="w-full mx-auto max-w-[1440px]">
        {data.seasons && (
          <CardSection
            sectionTitle={`${data.number_of_seasons} season${
              data.number_of_seasons > 1 ? "s" : ""
            }`}
            data={[...data.seasons].reverse()}
            mediaType={"season"}
            mediaId={data.id}
          />
        )}

        <div className="px-6">
          <div className="pt-5">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">
              About {data?.title || data?.name || "Unknown"}
            </h1>
            <p className="text-primary-2 text-sm md:text-base">{data?.overview || ""}</p>
          </div>

          {data?.genres && data.genres.length > 0 && (
            <div className="pt-5">
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">Genres</h1>
              <div className="flex flex-wrap gap-3">
                {data.genres.map((genre) => {
                  return (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-primary-2/20 text-primary-2 text-sm rounded-full"
                    >
                      {genre.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div ref={watchNowRef}>
            <WatchProviderSection watchProviders={watchProviders} />
          </div>
        </div>

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
              onItemClick={openImageModal}
              initialDisplayCount={12}
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
              onItemClick={openVideoModal}
              initialDisplayCount={8}
              loadMoreCount={6}
            />
          </section>
        )}

        {data?.credits?.cast && data.credits.cast.length > 0 && (
          <CardSection
            sectionTitle={"Top cast"}
            data={data.credits.cast.slice(0, 10)}
            mediaType={"person"}
          />
        )}

        {data?.recommendations?.results && data.recommendations.results.length > 0 && (
          <CardSection
            sectionTitle={"You may also like"}
            data={data.recommendations.results}
            mediaType={mediaType}
          />
        )}
        {data?.similar?.results && data.similar.results.length > 0 && (
          <CardSection
            sectionTitle={`${mediaType === "movie" ? "Movies" : "Shows"} similar to ${
              data.title || data.name
            }`}
            data={data.similar.results}
            mediaType={mediaType}
          />
        )}
      </div>
      {isVideoModalOpen && (
        <VideoModal closeVideoModal={closeVideoModal} videoObj={selectedVideo} />
      )}

      {isImageModalOpen && selectedImage && (
        <ImageModal closeImageModal={closeImageModal} imageObj={selectedImage} />
      )}
    </div>
  );
}
