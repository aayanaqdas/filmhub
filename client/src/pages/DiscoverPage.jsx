import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDiscoverPageData } from "../hooks/useDiscoverPageData";
import Cards from "../components/CardSections/Cards";
import { movieProviders } from "../movieProviders";
import { tvProviders } from "../tvProviders";
import { movieGenres, tvGenres } from "../genres";
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
  const [filters, setFilters] = useState({
    providers: [],
    genres: [],
    dateFrom: null,
    dateTo: null,
    sortBy: "popularity.desc",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [expanded, setExpanded] = useState({
    sort: false,
    where: false,
    filters: false,
  });
  const { mediaType } = useParams();
  // Reset genres and providers when mediaType changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      providers: [],
      genres: [],
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      providers: [],
      genres: [],
    }));
  }, [mediaType]);

  const { data, loading, error } = useDiscoverPageData(mediaType, appliedFilters);

  const region = localStorage.getItem("region") || "US";
  const watchProviders = mediaType === "movie" ? movieProviders : tvProviders;
  const providersForCountry = useMemo(
    () =>
      watchProviders.filter(
        (provider) =>
          provider.display_priorities && provider.display_priorities[region] !== undefined
      ),
    [watchProviders, region]
  );

  const cards = useMemo(
    () =>
      data?.map((media) => (
        <Cards
          key={media.id}
          id={media.id}
          mediaType={mediaType}
          posterPath={media.poster_path}
          title={media.title ? media.title : media.name}
          voteAverage={media.vote_average}
        />
      )),
    [data, mediaType]
  );

  // Check if filters have changed
  const filtersChanged = !areFiltersEqual(filters, appliedFilters);

  const handleShowResults = () => {
    setAppliedFilters(filters);
  };

  const genres = mediaType === "movie" ? movieGenres : tvGenres;

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

  return (
    <main className="flex flex-col sm:flex-row min-h-screen mt-20">
      {/* Sidebar */}
      <aside className="min-w-80 sm:max-w-80 p-6 space-y-4">
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
          <GenreFilter filters={filters} setFilters={setFilters} genres={genres} />
          <div className="mt-4">
            <ReleaseDates filters={filters} setFilters={setFilters} />
          </div>
        </FilterBtns>
      </aside>
      {/* Main Content */}
      <section className="flex-1 p-8 justify-center">
        <h1 className="font-bold text-3xl text-white mb-8 tracking-wide">Discover Movies</h1>
        <div className="flex flex-wrap gap-8">{cards}</div>
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
