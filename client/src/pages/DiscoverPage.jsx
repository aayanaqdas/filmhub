import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDiscoverPageData } from "../hooks/useDiscoverPageData";
import Cards from "../components/CardSections/Cards";
import FilterBtns from "../components/DiscoverPages/FilterBtns";
import SortFilter from "../components/DiscoverPages/SortFilter";
import WhereToWatchFilter from "../components/DiscoverPages/ProvidersFilter";
import GenreFilter from "../components/DiscoverPages/GenreFilter";
import ReleaseDates from "../components/DiscoverPages/ReleaseDateFilter";

// Helper to compare filters
function areFiltersEqual(a, b) {
  return (
    a.sortBy === b.sortBy &&
    a.dateFrom === b.dateFrom &&
    a.dateTo === b.dateTo &&
    a.providers.length === b.providers.length &&
    a.providers.every((id, i) => b.providers[i] === id) &&
    a.genres.length === b.genres.length &&
    a.genres.every((id, i) => b.genres[i] === id)
  );
}

export default function DiscoverPage() {
  const { mediaType } = useParams();

  // Initial filter state
  const initialFilters = useMemo(
    () => ({
      providers: [],
      genres: [],
      dateFrom: null,
      dateTo: null,
      sortBy: "popularity.desc",
      voteCountGte: 200,
    }),
    []
  );

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [expanded, setExpanded] = useState({ sort: false, where: false, filters: false });
  const [watchProviders, setWatchProviders] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const region = localStorage.getItem("region") || "US";
  const { data, loading, error } = useDiscoverPageData(mediaType, appliedFilters, page);

  // Reset filters when mediaType changes
  useEffect(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
  }, [mediaType, initialFilters]);

  // Dynamically import providers based on mediaType
  useEffect(() => {
    let isMounted = true;
    async function loadProviders() {
      const providersModule =
        mediaType === "movie" ? await import("../movieProviders") : await import("../tvProviders");
      if (isMounted) {
        setWatchProviders(
          mediaType === "movie" ? providersModule.movieProviders : providersModule.tvProviders
        );
      }
    }
    loadProviders();
    return () => {
      isMounted = false;
    };
  }, [mediaType]);

  // Providers filtered by region
  const providersForCountry = useMemo(
    () =>
      watchProviders.filter(
        (provider) =>
          provider.display_priorities && provider.display_priorities[region] !== undefined
      ),
    [watchProviders, region]
  );

  useEffect(() => {
    if (!loading) {
      setIsLoadingMore(false);
    }
  }, [loading]);

  const detectEnd = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      if (!loading && !isLoadingMore && data?.total_pages > page) {
        setIsLoadingMore(true);
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, isLoadingMore, page, data?.total_pages]);

  useEffect(() => {
    if (mediaType && data?.total_results !== 0) {
      document.addEventListener("scroll", detectEnd);
      return () => document.removeEventListener("scroll", detectEnd);
    }
  }, [mediaType, data?.total_results, detectEnd]);

  // Render cards
  const cards = useMemo(() => {
    if (!data?.results) return [];

    // Remove duplicates based on id
    const seen = new Set();
    const uniqueResults = data.results.filter((media) => {
      if (seen.has(media.id)) return false;
      seen.add(media.id);
      return true;
    });

    return uniqueResults.map((media) => (
      <Cards
        key={media.id}
        id={media.id}
        mediaType={mediaType}
        posterPath={media.poster_path}
        title={media.title || media.name}
        voteAverage={media.vote_average}
      />
    ));
  }, [data, mediaType]);

  // Check if filters have changed
  const filtersChanged = !areFiltersEqual(filters, appliedFilters);

  // Apply filters
  const handleShowResults = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg text-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  // Loading state
  if (page === 1 && loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-2 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-2 border-t-transparent"></div>
      </div>
    );
  }

  // Main render
  return (
    <main className="flex flex-col sm:flex-row min-h-screen mt-20">
      {/* Sidebar */}
      <aside className="min-w-100 sm:max-w-100 p-6 space-y-4 sm:sticky sm:top-20 sm:self-start sm:h-[calc(100vh-5rem)] sm:overflow-y-auto">
        <h2 className="text-xl font-bold text-primary-2 mb-6 tracking-wide">Filters</h2>
        <FilterBtns
          title="Sort"
          expanded={expanded.sort}
          onClick={() => setExpanded((prev) => ({ ...prev, sort: !prev.sort }))}
        >
          <SortFilter filters={filters} setFilters={setFilters} mediaType={mediaType} />
        </FilterBtns>
        <FilterBtns
          title="Where to watch"
          expanded={expanded.where}
          onClick={() => setExpanded((prev) => ({ ...prev, where: !prev.where }))}
          providerLength={providersForCountry.length}
        >
          <WhereToWatchFilter
            filters={filters}
            setFilters={setFilters}
            providersForCountry={providersForCountry}
          />
        </FilterBtns>
        <FilterBtns
          title="Filters"
          expanded={expanded.filters}
          onClick={() => setExpanded((prev) => ({ ...prev, filters: !prev.filters }))}
        >
          <GenreFilter filters={filters} setFilters={setFilters} mediaType={mediaType} />
          <div className="mt-4">
            <ReleaseDates filters={filters} setFilters={setFilters} />
          </div>
        </FilterBtns>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 justify-center">
        <h1 className="font-bold text-3xl text-white mb-8 tracking-wide">
          Discover {mediaType === "movie" ? "Movies" : "TV Shows"}
        </h1>
        {/* No results found text */}
        {data?.total_results === 0 ? (
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-gray-400 text-xl mb-4">No results found</div>
              <p className="text-gray-500 text-center">Try again with different filters</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-8">{cards}</div>
        )}
        {/* Show loading spinner */}
        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
          </div>
        )}
      </section>

      {/* Show results button only visible if a new filter is applied */}
      {filtersChanged && (
        <button
          className="w-full fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-2 font-semibold px-8 py-4 shadow-lg transition-all hover:brightness-80 cursor-pointer"
          onClick={handleShowResults}
        >
          Show Results
        </button>
      )}
    </main>
  );
}
