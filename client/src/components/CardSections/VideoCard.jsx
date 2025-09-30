import { useState } from "react";

export default function VideoCard({ video, onVideoClick, page }) {
  const [imageError, setImageError] = useState(false);

  const getVideoTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "trailer":
        return "bg-red-600/90";
      case "teaser":
        return "bg-orange-600/90";
      case "clip":
        return "bg-blue-600/90";
      case "featurette":
        return "bg-purple-600/90";
      case "behind the scenes":
        return "bg-green-600/90";
      case "bloopers":
        return "bg-yellow-600/90";
      default:
        return "bg-gray-600/90";
    }
  };

  const getVideoTypePriority = (type) => {
    const priorities = {
      Trailer: 1,
      Teaser: 2,
      Clip: 3,
      Featurette: 4,
      "Behind the Scenes": 5,
      Bloopers: 6,
    };
    return priorities[type] || 999;
  };

  const getThumbnailUrl = (key, quality = "mqdefault") => {
    return `https://img.youtube.com/vi/${key}/${quality}.jpg`;
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  // Add priority indicator for high-priority videos
  const isHighPriority = getVideoTypePriority(video.type) <= 2; // Trailers and Teasers

  if (page === "homepage") {
    return (
      <div className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/30 hover:border-primary-2/50 hover:shadow-lg hover:shadow-primary-2/10 transition-all duration-300 group cursor-pointer">
        {/* Video Thumbnail */}
        <div
          className="aspect-video bg-gray-700 relative overflow-hidden"
          onClick={() => onVideoClick(video)}
        >
          <img
            src={imageError ? getThumbnailUrl(video.key, "hqdefault") : getThumbnailUrl(video.key)}
            alt={video.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="[&>svg]:h-15 [&>svg]:w-15 [&>svg]:fill-[#ff0000]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Simple Video Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary-2 transition-colors duration-200">
            {video.movieTitle} - {video.name}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/30 hover:border-primary-2/50 hover:shadow-lg hover:shadow-primary-2/10 transition-all duration-300 group cursor-pointer">
      {/* Video Thumbnail */}
      <div
        className="aspect-video bg-gray-700 relative overflow-hidden"
        onClick={() => onVideoClick(video)}
      >
        <img
          src={imageError ? getThumbnailUrl(video.key, "hqdefault") : getThumbnailUrl(video.key)}
          alt={video.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="[&>svg]:h-15 [&>svg]:w-15 [&>svg]:fill-[#ff0000]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
            </svg>
          </span>
        </div>

        {/* Video Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2 py-1 ${getVideoTypeColor(
              video.type
            )} backdrop-blur-sm text-white text-xs font-medium rounded-md border border-gray-600/50`}
          >
            {video.type}
          </span>
        </div>

        {/* Site Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-md border border-gray-600/50">
            {video.site}
          </span>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-2 transition-colors duration-200">
          {video.name}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="capitalize">{video.type}</span>
          {video.published_at && <span>{new Date(video.published_at).getFullYear()}</span>}
        </div>

        {/* Video Quality and Priority Indicators */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${isHighPriority ? "bg-primary-2" : "bg-red-500"}`}
            ></div>
            <span className="text-xs text-gray-400">HD</span>
          </div>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">{video.site}</span>
          {isHighPriority && (
            <>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-primary-2">Popular</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
