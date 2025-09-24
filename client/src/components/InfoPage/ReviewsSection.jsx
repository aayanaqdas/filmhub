import ReviewCard from "../CardSections/ReviewCard";
import { useState, useMemo } from "react";

export default function ReviewsSection({ data }) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedReviews = useMemo(() => {
    if (!data?.results) return [];

    const reviews = [...data.results];

    switch (sortBy) {
      case "date-desc":
        return reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "date-asc":
        return reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "rating-desc":
        return reviews.sort(
          (a, b) => (b.author_details?.rating || 0) - (a.author_details?.rating || 0)
        );
      case "rating-asc":
        return reviews.sort(
          (a, b) => (a.author_details?.rating || 0) - (b.author_details?.rating || 0)
        );
      default:
        return reviews;
    }
  }, [data?.results, sortBy]);

  const reviewsToShow = showAllReviews ? sortedReviews : sortedReviews.slice(0, 5);

  return (
    <section className="w-full pt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-7">
        <h1 className="text-primary-2 text-2xl md:text-3xl font-bold">
          Reviews ({data?.results?.length || 0})
        </h1>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-2 transition-colors cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="rating-desc">Rating (High to Low)</option>
            <option value="rating-asc">Rating (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="px-7">
        {reviewsToShow.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show All Reviews Button */}
      {!showAllReviews && data?.results?.length > 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleShowAllReviews}
            className="text-primary hover:text-white transition-colors text-sm cursor-pointer"
          >
            View all {data.total_results || data.results.length} reviews
          </button>
        </div>
      )}
    </section>
  );
}
