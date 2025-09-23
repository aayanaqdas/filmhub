import { useState } from "react";

export default function VideoCard({ video, onVideoClick }) {
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
      default:
        return "bg-gray-600/90";
    }
  };

  const getThumbnailUrl = (key, quality = "maxresdefault") => {
    return `https://img.youtube.com/vi/${key}/${quality}.jpg`;
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

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
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Video Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 ${getVideoTypeColor(video.type)} backdrop-blur-sm text-white text-xs font-medium rounded-md border border-gray-600/50`}>
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
          {video.published_at && (
            <span>{new Date(video.published_at).getFullYear()}</span>
          )}
        </div>

        {/* Video Quality Indicator */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-400">HD</span>
          </div>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">{video.site}</span>
        </div>
      </div>
    </div>
  );
}