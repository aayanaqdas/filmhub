import { useState } from "react";
import StarRating from "../StarRating";

export default function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get avatar URL or fallback
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("/https://")) {
      return avatarPath.substring(1); // Remove the leading slash
    }
    return `https://image.tmdb.org/t/p/w200${avatarPath}`;
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const avatarUrl = getAvatarUrl(review.author_details?.avatar_path);
  const displayName = review.author_details?.name || review.author || "Anonymous";
  const rating = review.author_details?.rating;

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-col sm:flex-row sm:items-start">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-2/20 to-primary-2/40 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center text-primary-2 font-semibold ${
                avatarUrl ? "hidden" : "flex"
              }`}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Author Info */}
          <div>
            <h3 className="text-white font-semibold text-lg truncate max-w-[200px] block">
              {displayName}
            </h3>
            <p className="text-primary-2 text-sm">{formatDate(review.created_at)}</p>
            {/* Rating - show below name/date on mobile */}
            {rating && (
              <div className="mt-1 block sm:hidden">
                <StarRating voteAverage={rating} />
              </div>
            )}
          </div>
        </div>

        {/* Rating - show on right for desktop */}
        {rating && (
          <div className="hidden sm:block">
            <StarRating voteAverage={rating} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-primary-2 leading-relaxed">
        <p className="whitespace-pre-wrap">
          {isExpanded ? review.content : truncateContent(review.content)}
        </p>

        {review.content.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-medium transition-colors cursor-pointer"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-2 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
        >
          View on TMDB
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
