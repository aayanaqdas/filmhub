import CardSection from "../components/CardSections/CardSection";
import HeroSection from "../components/InfoPage/HeroSection";
import PersonInfo from "../components/InfoPage/PersonInfo";
import SeasonInfoPage from "../components/InfoPage/SeasonInfoPage";
import WatchProviderSection from "../components/InfoPage/WatchProviders";
import VideoModal from "../components/InfoPage/VideoModal";
import ImageModal from "../components/InfoPage/ImageModal";
import MediaGalleryFilters from "../components/InfoPage/MediaGalleryFilters";
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
  const [selectedVideo, setSelectedVideo] = useState(null);

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

        {data?.credits?.cast && data.credits.cast.length > 0 && (
          <CardSection
            sectionTitle={"Top cast"}
            data={data.credits.cast.slice(0, 10)}
            mediaType={"person"}
          />
        )}

        <MediaGalleryFilters
          images={data.images}
          videos={data.videos}
          onImageClick={openImageModal}
          onVideoClick={openVideoModal}
        />

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
