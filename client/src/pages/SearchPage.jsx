import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchData } from "../hooks/useSearchPageData";
import SearchCard from "../components/CardSections/SearchCard";
import { useTrendingData } from "../hooks/useTrendingData";
import Cards from "../components/CardSections/Cards";

export default function SearchPage() {
  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
  } = useTrendingData("day");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("multi");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useSearchData(searchQuery, filter, page);

  // Handle URL changes (for link sharing)
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    setPage(1);
    setIsLoadingMore(false);
  }, [searchParams]);

  // Handle form submission (Enter key)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get value directly from the form
    const formData = new FormData(e.target);
    const inputValue = formData.get("search");

    // Update search query and URL
    setSearchQuery(inputValue);
    setPage(1);

    if (inputValue.trim()) {
      setSearchParams({ q: inputValue });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (!searchLoading) {
      setIsLoadingMore(false);
    }
  }, [searchLoading]);

  const detectEnd = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      if (!searchLoading && !isLoadingMore && searchData?.total_pages > page) {
        setIsLoadingMore(true);
        setPage((prevPage) => prevPage + 1);
        console.log("load more", page);
      }
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      document.addEventListener("scroll", detectEnd);

      return () => {
        document.removeEventListener("scroll", detectEnd);
      };
    }
  }, [searchQuery, searchLoading, isLoadingMore, page, searchData?.total_pages]);

  const renderDefaultContent = () => {
    const exampleQueries = trendingData?.slice(12, 16).map((item) => item.title || item.name) || [
      "Inception",
      "Breaking Bad",
      "Kevin Hart",
      "Suits",
    ];

    return (
      <div className="w-full max-w-7xl mx-auto px-6 mb-8">
        {/* Discover Section */}
        <div className="mb-12">
          <h2 className="text-white text-3xl font-bold mb-4">Discover Movies & TV Shows</h2>
          <p className="text-gray-400 text-lg">
            Search for your favorite movies, TV shows, and celebrities, or explore trending content.
          </p>
        </div>

        {/* Search Tips Section */}
        <div className="mb-12">
          <p className="text-gray-400 text-lg mb-6">
            Not sure what to search for? Try one of these popular queries:
          </p>
          <div className="flex flex-wrap gap-4">
            {exampleQueries.map((query) => (
              <button
                key={query}
                onClick={() => setSearchParams({ q: query })}
                className="bg-gray-800/80 text-white px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-md cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">Trending Today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {trendingLoading && <p className="text-gray-400">Loading...</p>}
            {trendingError && <p className="text-red-500">Error loading trending content.</p>}
            {trendingData?.map((item) => (
              <Cards
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                mediaType={item.media_type}
                posterPath={item.poster_path || item.profile_path}
                voteAverage={item.vote_average}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    if (searchError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg text-lg">
            Error: {searchError}
          </div>
        </div>
      );
    }
    // Skeelton only for page 1 or no data
    if (searchLoading && (page === 1 || !searchData?.results?.length)) {
      return (
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-start bg-gray-800/50 rounded-lg p-4 animate-pulse">
                <div className="w-20 h-30 sm:w-24 sm:h-36 bg-gray-700 rounded-md flex-shrink-0"></div>
                <div className="ml-4 flex-1 space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Show results
    return (
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => {
              setFilter("multi");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "multi" ? "bg-primary text-white" : "bg-gray-800/80 text-gray-300"
            } hover:bg-primary-1 transition`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter("movie");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "movie" ? "bg-primary text-white" : "bg-gray-800/80 text-gray-300"
            } hover:bg-primary-1 transition`}
          >
            Movies
          </button>
          <button
            onClick={() => {
              setFilter("tv");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "tv" ? "bg-primary text-white" : "bg-gray-800/80 text-gray-300"
            } hover:bg-primary-1 transition`}
          >
            TV Shows
          </button>
          <button
            onClick={() => {
              setFilter("person");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "person" ? "bg-primary text-white" : "bg-gray-800/80 text-gray-300"
            } hover:bg-primary-1 transition `}
          >
            People
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Search Results</h2>
          <p className="text-primary-2">
            Found {searchData?.total_results} result{searchData?.total_results !== 1 ? "s" : ""} for
            "{searchQuery}"
          </p>
        </div>

        <div className="space-y-4">
          {searchData?.results?.map((item, index) => (
            <SearchCard
              key={`${item.id}-${item.media_type}-${index}`} // Use index for better uniqueness
              id={item.id}
              title={item.title || item.name}
              mediaType={item.media_type || filter}
              posterPath={item.poster_path || item.profile_path}
              voteAverage={item.vote_average}
              overview={item.overview}
              releaseDate={item.release_date}
              firstAirDate={item.first_air_date}
            />
          ))}
        </div>

        {/* Show loading spinner */}
        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
          </div>
        )}

        {searchData?.total_results === 0 && searchQuery.trim() && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 text-xl mb-4">No results found</div>
            <p className="text-gray-500 text-center">
              Try searching with different keywords, filters or check your spelling
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center pt-20 pb-20">
      <div className="w-full max-w-7xl mx-auto px-6 mb-8">
        <form onSubmit={handleSubmit} className="relative">
          <input
            name="search"
            type="search"
            placeholder="Search for movies, TV shows, people..."
            defaultValue={searchParams.get("q") || ""}
            className="w-full px-6 py-4 pr-12 bg-gray-800/80 text-white rounded-lg border border-gray-700 focus:border-primary-2 focus:outline-none focus:ring-2 focus:ring-primary-2/20 transition-all duration-300 text-lg"
            autoComplete="off"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>
      </div>
      {searchQuery ? renderSearchResults() : renderDefaultContent()}
    </div>
  );
}
