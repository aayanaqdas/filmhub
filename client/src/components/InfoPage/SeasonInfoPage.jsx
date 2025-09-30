import { useState } from "react";
import { useNavigate } from "react-router-dom";
import noImg from "../../assets/no_image.svg";
import EpisodeCard from "./EpisodeCards";
import WatchProviderSection from "./WatchProviders";
import MediaGalleryFilters from "./MediaGalleryFilters";
import ImageModal from "./ImageModal";
import VideoModal from "./VideoModal";

export default function SeasonInfoPage({ data, loading, error, showId, showTitle }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedEpisode, setExpandedEpisode] = useState(null);
  const [sortBy, setSortBy] = useState("episode");
  const navigate = useNavigate();

  const userRegion = localStorage.getItem("region") || "US";
  const watchProviders = data["watch/providers"]?.results?.[userRegion] || null;

  const toggleEpisode = (episodeId) => {
    setExpandedEpisode(expandedEpisode === episodeId ? null : episodeId);
  };

  const sortEpisodes = (episodes) => {
    if (!episodes) return [];

    return [...episodes].sort((a, b) => {
      switch (sortBy) {
        case "air_date":
          return new Date(a.air_date) - new Date(b.air_date);
        case "rating":
          return b.vote_average - a.vote_average;
        default:
          return a.episode_number - b.episode_number;
      }
    });
  };

  const handleGoBack = () => {
    if (showId) {
      navigate(`/tv/${showId}`);
    } else {
      navigate(-1);
    }
  };

  if (!data || loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-2 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg text-lg">
          Error: {error}
        </div>
      </div>
    );
  }

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

  const sortedEpisodes = sortEpisodes(data.episodes);

  return (
    <div className="max-w-7xl mx-auto mt-16 sm:mt-20 ">
      <div className="px-6">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-primary hover:text-primary-2 transition-colors mb-6 group cursor-pointer"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium text-sm">
            {showTitle ? `Back to ${showTitle}` : "Back to show"}
          </span>
        </button>

        {/* Season Header */}
        <div className="flex flex-row gap-6 mb-6">
          <img
            src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : noImg}
            className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg object-cover mx-auto sm:mx-0 flex-shrink-0"
            alt={data.name}
          />

          <div className="flex-1 text-left">
            <div className=" flex items-center gap-4 mb-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {data.name}
              </h1>
              <span className="text-gray-400">({new Date(data.air_date).getFullYear()})</span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-start gap-4 text-sm">
              <div className="text-left">
                <span className="text-gray-400 block">Episodes</span>
                <span className="text-white font-medium">{data.episodes?.length || 0}</span>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-gray-400 block">First Aired</span>
                <span className="text-white font-medium">
                  {new Date(data.air_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {data.vote_average > 0 && (
                <div className="text-center sm:text-left">
                  <span className="text-gray-400 block">Rating</span>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium">{data.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Overview */}
        {data.overview && (
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">{data.overview}</p>
        )}

        {/* Watch Providers */}
        <WatchProviderSection watchProviders={watchProviders} />
      </div>

      <MediaGalleryFilters
        images={data.images}
        videos={data.videos}
        onImageClick={openImageModal}
        onVideoClick={openVideoModal}
      />

      {/* Episodes Section */}
      <div className="mt-8 px-6">
        {/* Header with Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-white">
            Episodes
            <span className="text-gray-400 text-base font-normal">
              ({data.episodes?.length || 0})
            </span>
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-2 transition-colors cursor-pointer"
            >
              <option value="air_date">Release date</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-4">
          {sortedEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              isExpanded={expandedEpisode === episode.id}
              onToggle={() => toggleEpisode(episode.id)}
            />
          ))}
        </div>
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
